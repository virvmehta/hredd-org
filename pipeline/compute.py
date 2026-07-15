#!/usr/bin/env python3
"""
hredd.org Trade Exposure Tracker pipeline, phase two.

Market model: each country's flows are split by destination market, with HS4
detail where a regime needs product scope. Class B regimes carry published
coverage bands; Class C regimes never receive values. Union and mechanism
decompositions are computed cell by cell so nothing double counts.
Design rules R1 to R5 unchanged, see /methodology/.
"""
import json, csv, hashlib, argparse, os, time, urllib.request, urllib.parse
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_JSON = os.path.join(HERE, "..", "public", "data", "trade-exposure.json")
OUT_CSV  = os.path.join(HERE, "..", "public", "data", "trade-exposure.csv")
YEARS = list(range(2024, 2031))
MECHS = ["border", "diligence", "disclosure"]
EU_MEMBER_MARKETS = {"DEU", "FRA", "NLD"}

def sha256(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for c in iter(lambda: f.read(65536), b""): h.update(c)
    return h.hexdigest()

def load(name):
    p = os.path.join(HERE, name)
    with open(p, encoding="utf-8") as f: d = json.load(f)
    d["_checksum"] = sha256(p); return d

def frac_at(regime, on):
    steps = regime.get("steps", [])
    if not steps: return 0.0
    return len([s for s in steps if s["date"] <= on]) / len(steps)

def band_of(regime):
    if regime["class"] == "A": return (1.0, 1.0, 1.0)
    if regime.get("band"): return tuple(regime["band"])
    return None  # priority_to_all handled separately

def cells_of(market_key, flows):
    """Return {cell_id: value} for a market, with a _rest cell so totals are exact."""
    m = flows["markets"].get(market_key)
    if not m: return {}
    by = dict(m.get("by_hs4", {}))
    rest = m["total"] - sum(by.values())
    out = {f"{market_key}:{h}": v for h, v in by.items() if v > 0}
    if rest > 0: out[f"{market_key}:_rest"] = rest
    return out

def regime_cells(regime, flows):
    """Cells a regime covers, at its central/low/high factors (before phase frac)."""
    mk = regime["market"]
    if regime["scope"] == "none": return None
    if mk in EU_MEMBER_MARKETS:
        share = flows.get("member_shares", {}).get(mk, 0)
        base = {k: v * share for k, v in cells_of("EU27", flows).items()}
        lo, c, hi = band_of(regime)
        return {"cells": base, "factors": (lo, c, hi)}
    if regime.get("band_mode") == "priority_to_all":
        all_cells = cells_of(mk, flows)
        chaps = set(regime["priority_chapters"])
        prio_cells = {k: v for k, v in all_cells.items() if k.split(":")[1][:2] in chaps}
        return {"cells": all_cells, "priority_cells": prio_cells, "factors": "priority_to_all"}
    all_cells = cells_of(mk, flows)
    if regime["scope"] == "product":
        chaps = set(regime["chapters"])
        all_cells = {k: v for k, v in all_cells.items() if k.split(":")[1][:2] in chaps}
    lo, c, hi = band_of(regime)
    return {"cells": all_cells, "factors": (lo, c, hi)}

def regime_values(regime, flows, on):
    f = frac_at(regime, on)
    rc = regime_cells(regime, flows)
    if rc is None or f == 0: return None if rc is None else (0.0, 0.0, 0.0)
    if rc["factors"] == "priority_to_all":
        prio = sum(rc["priority_cells"].values()); full = sum(rc["cells"].values())
        return (prio * f, prio * f, full * f)
    lo, c, hi = rc["factors"]; base = sum(rc["cells"].values())
    return (base * f * lo, base * f * c, base * f * hi)

def cell_coverage(regimes, flows, on, mech_filter=None):
    """Central-estimate coverage per cell: max over regimes, capped at 1."""
    cov = {}
    for r in regimes:
        if r["scope"] == "none": continue
        if mech_filter and r["mechanism"] != mech_filter: continue
        f = frac_at(r, on)
        if f == 0: continue
        rc = regime_cells(r, flows)
        if rc["factors"] == "priority_to_all":
            target, factor = rc["priority_cells"], 1.0
        else:
            target, factor = rc["cells"], rc["factors"][1]
        for k in target:
            cov[k] = max(cov.get(k, 0.0), min(1.0, f * factor))
    all_cells = {}
    for mk in flows["markets"]: all_cells.update(cells_of(mk, flows))
    return sum(all_cells.get(k, 0.0) * c for k, c in cov.items())

# ---------------- live fetch from UN Comtrade ----------------
# Endpoint confirmed directly from the comtradeapi.un.org "comtrade - v1" product,
# GET operation, on 2026-07-14. typeCode=C (commodities), freqCode=A (annual),
# clCode=HS. Reporter/partner values are M49 numeric country codes.

COMTRADE_BASE = "https://comtradeapi.un.org/data/v1/get/C/A/HS"

# M49 codes for the ten tracked origin countries (reporters)
ORIGIN_M49 = {
    # India is 699, not the M49 statistical standard 356, which Comtrade labels
    # "India (...1974)" and retired after Sikkim's 1975 merger. Comtrade's own
    # codes mostly track M49 but diverge for a handful of historical splits like
    # this one, confirmed against comtradeapi.un.org/files/v1/app/reference/
    # partnerAreas.json on 2026-07-14 rather than assumed from the M49 standard.
    "bangladesh": "50", "india": "699", "vietnam": "704", "indonesia": "360",
    "brazil": "76", "thailand": "764", "ethiopia": "231", "kenya": "404",
    "ghana": "288", "cote-divoire": "384",
}

# M49 codes for tracked markets. The EU27 has no single reliable bilateral
# partner code across all reporters in Comtrade, so it is queried as the sum
# of its 27 member states rather than one aggregate call.
MARKET_M49 = {
    "USA": "842", "GBR": "826", "CAN": "124", "AUS": "36",
    "NOR": "578", "CHE": "756", "JPN": "392", "KOR": "410",
}
EU27_M49 = {
    "AUT": "40", "BEL": "56", "BGR": "100", "HRV": "191", "CYP": "196",
    "CZE": "203", "DNK": "208", "EST": "233", "FIN": "246", "FRA": "251",
    "DEU": "276", "GRC": "300", "HUN": "348", "IRL": "372", "ITA": "380",
    "LVA": "428", "LTU": "440", "LUX": "442", "MLT": "470", "NLD": "528",
    "POL": "616", "PRT": "620", "ROU": "642", "SVK": "703", "SVN": "705",
    "ESP": "724", "SWE": "752",
}

CHAPTERS = ['01','02','03','09','12','15','16','18','20','26','28','38','39',
    '40','44','47','48','50','51','52','53','54','55','56','57','58','59',
    '60','61','62','63','71','76','85','94']

def _normalize_codes(params):
    """The Comtrade API expects reporterCode/partnerCode without the leading
    zeros that the official M49 standard pads onto codes under 100 (e.g.
    Bangladesh is M49 050 but the API wants "50"). Strip them here so any
    future zero-padded code is corrected automatically instead of silently
    returning zero rows. Handles comma-separated batched code lists too,
    element by element. cmdCode is deliberately left alone: HS chapter codes
    like "01" carry a meaningful leading zero."""
    out = dict(params)
    for field in ("reporterCode", "partnerCode"):
        if field in out:
            parts = str(out[field]).split(",")
            if all(p.strip().isdigit() for p in parts):
                out[field] = ",".join(str(int(p)) for p in parts)
    return out

def comtrade_get(params, key, retries=4, pace=1.0):
    """Single GET against the Comtrade v1 data API, with the subscription key
    header and exponential backoff on transient failures. Raises on the final
    attempt so a real error surfaces rather than being silently swallowed.

    A fixed pause runs before every call, not only inside the EU loop, since
    the free tier appears to enforce a per-minute cap that returns a 200 with
    an empty data array rather than a 429 when exceeded. That is
    indistinguishable from "no data exists" unless calls are paced
    defensively regardless of how many succeeded just before."""
    time.sleep(pace)
    params = _normalize_codes(params)
    url = COMTRADE_BASE + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={
        "Ocp-Apim-Subscription-Key": key, "Accept": "application/json"})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")[:500]
            if e.code == 429 and attempt < retries - 1:
                time.sleep(2 ** attempt * 5)
                continue
            raise SystemExit(
                f"Comtrade API error {e.code} on reporter={params.get('reporterCode')} "
                f"partner={params.get('partnerCode')}: {body}")
        except urllib.error.URLError as e:
            if attempt < retries - 1:
                time.sleep(2 ** attempt * 5)
                continue
            raise SystemExit(f"Comtrade network error: {e}")
    raise SystemExit("Comtrade API exhausted retries without a response")

# All ten origin countries are fetched in each call as one comma-separated
# partnerCode list. Verified against the keyless public preview endpoint on
# 2026-07-15: one call to reporter 842 with partnerCode=50,699,704 returned one
# correctly-valued row per partner. Batching cuts a full run from roughly 390
# calls to roughly 42, which fits inside a partially-spent free-tier day.
ALL_ORIGINS = ",".join(ORIGIN_M49.values())
ORIGIN_BY_CODE = {str(int(v)): k for k, v in ORIGIN_M49.items()}
# cmdCode also accepts comma lists (verified the same day, leading zeros
# preserved), so chapter calls request only the 34 tracked chapters instead of
# AG2's full ~97. That keeps every response far below any record cap: the
# preview endpoint demonstrably truncates at its cap SILENTLY, with the count
# field reporting only the rows returned, so small responses plus an explicit
# maxRecords guard are the only reliable defences.
ALL_CHAPTERS = ",".join(CHAPTERS)
MAX_RECORDS = 10000

def _rows_by_origin(data):
    """Group response rows by origin country slug, keyed off partnerCode."""
    rows = data.get("data") or []
    if len(rows) >= MAX_RECORDS:
        raise SystemExit(f"Response hit the {MAX_RECORDS}-row guard, possible truncation")
    out = {}
    for row in rows:
        slug = ORIGIN_BY_CODE.get(str(row.get("partnerCode", "")))
        if slug:
            out.setdefault(slug, []).append(row)
    return out

def latest_available_year(key):
    """Find the most recent year with mirror data, probing with the USA as
    reporter and all ten origins as partners in one call. Availability depends
    on the reporting destination markets, not the origins, since every figure
    in this pipeline is destination-reported, so a single common year is
    correct as well as cheaper than the old per-origin probing.

    Note that reporterCode=0 does NOT work as an all-reporters wildcard on
    this endpoint, even though partnerCode=0 does work as an all-partners
    wildcard. An earlier version assumed the symmetry held and silently
    returned zero rows for every origin country."""
    this_year = date.today().year
    for y in range(this_year - 1, this_year - 5, -1):
        data = comtrade_get({
            "reporterCode": MARKET_M49["USA"], "period": str(y),
            "partnerCode": ALL_ORIGINS, "cmdCode": "TOTAL", "flowCode": "M",
            "breakdownMode": "classic", "maxRecords": MAX_RECORDS,
        }, key)
        if data.get("data"):
            return y
    raise SystemExit("No mirror data found for any tracked origin in the last 4 years")

def fetch_all_flows(key, year):
    """Build every country's flows entry using mirror statistics throughout:
    every figure is the destination market's own reported imports from the
    origin country, not the origin country's self-reported exports, since
    several tracked origins report to Comtrade irregularly or not at all.
    One call per reporting market covers all ten origins at once."""
    markets_by_origin = {slug: {} for slug in ORIGIN_M49}

    def get(reporter, cmd):
        return comtrade_get({
            "reporterCode": reporter, "period": str(year), "partnerCode": ALL_ORIGINS,
            "cmdCode": cmd, "flowCode": "M", "breakdownMode": "classic",
            "maxRecords": MAX_RECORDS,
        }, key)

    # non-EU markets: each market reports its own imports from all ten origins
    for mkey, m49 in MARKET_M49.items():
        per = _rows_by_origin(get(m49, "TOTAL"))
        for slug in ORIGIN_M49:
            rows = per.get(slug, [])
            markets_by_origin[slug][mkey] = {
                "total": sum(float(r["primaryValue"]) for r in rows)}

    # USA by_hs4: needed because UFLPA scope is chapter-level within the US market
    per = _rows_by_origin(get(MARKET_M49["USA"], ALL_CHAPTERS))
    for slug, rows in per.items():
        by = {}
        for row in rows:
            code = str(row.get("cmdCode", "")).zfill(2)
            if code in CHAPTERS:
                by[code + "00"] = by.get(code + "00", 0.0) + float(row["primaryValue"])
        if by:
            markets_by_origin[slug]["USA"]["by_hs4"] = by

    # EU27: sum each member's own reported imports from each origin country.
    eu_totals = {slug: 0.0 for slug in ORIGIN_M49}
    for member_iso, member_m49 in EU27_M49.items():
        per = _rows_by_origin(get(member_m49, "TOTAL"))
        for slug, rows in per.items():
            eu_totals[slug] += sum(float(r["primaryValue"]) for r in rows)
    for slug in ORIGIN_M49:
        markets_by_origin[slug]["EU27"] = {"total": eu_totals[slug]}

    # EU chapter mix: a full 27-member chapter breakdown would double the call
    # count for no material gain, so this uses the four largest EU importers as
    # a representative proxy for product mix while the total above still
    # reflects all 27 members. Documented in the dataset vintage as an
    # approximation, consistent with the site's practice of stating
    # simplifications rather than hiding them.
    eu_by = {slug: {} for slug in ORIGIN_M49}
    for proxy_m49 in ("276", "251", "528", "380"):  # Germany, France, Netherlands, Italy
        per = _rows_by_origin(get(proxy_m49, ALL_CHAPTERS))
        for slug, rows in per.items():
            for row in rows:
                code = str(row.get("cmdCode", "")).zfill(2)
                if code in CHAPTERS:
                    eu_by[slug][code + "00"] = eu_by[slug].get(code + "00", 0.0) + float(row["primaryValue"])
    for slug, by in eu_by.items():
        if by:
            markets_by_origin[slug]["EU27"]["by_hs4"] = by

    # The denominator is the sum of the nine tracked destination markets rather
    # than a true world export total, because no single reliable world figure
    # exists for origins that under-report to Comtrade. Every share on the site
    # is therefore "share of exports to tracked regulated markets", not "share
    # of all exports", which is the more meaningful denominator for this tracker
    # in any case. Stated in the dataset vintage rather than left implicit.
    country_flows = {}
    for slug in ORIGIN_M49:
        markets = markets_by_origin[slug]
        total = sum(m["total"] for m in markets.values())
        if total <= 0:
            raise SystemExit(f"All tracked markets returned zero imports from {slug} in {year}")
        country_flows[slug] = {
            "name": slug.replace("-", " ").title(),
            "total_exports_usd": total,
            "markets": markets,
            "member_shares": {},  # not computable from a four-member proxy; left for a future refinement
        }
    return country_flows

def build_live(key):
    year = latest_available_year(key)
    country_flows = fetch_all_flows(key, year)
    for slug, f in country_flows.items():
        print(f"fetched {slug}: {year}, total=${f['total_exports_usd']:,.0f}")
    return {
        "sample": False,
        "dataset_version": f"comtrade-live-{date.today().isoformat()}",
        "vintage": ("Figures come from UN Comtrade. For each country we use what its buyer "
            "markets reported importing, rather than what the country itself reported exporting, "
            "because several tracked countries report to Comtrade late or not at all. Every share "
            "is measured against that country's exports to the nine regulated markets this index "
            "tracks, not against its total exports to the world, because no reliable world total "
            "exists for countries that under-report. European Union figures add up all twenty "
            "seven member states. The European product mix is estimated from the four largest "
            "importers, Germany, France, the Netherlands and Italy, to keep the pipeline within "
            "its free daily data allowance."),
        "sources": ["UN Comtrade Database, https://comtradeplus.un.org, mirror (partner-reported) statistics"],
        "countries": country_flows,
    }


def build(mode):
    scope = load("law_scope.json")
    if mode == "sample":
        raw = load(os.path.join("sample", "flows.json"))
    else:
        key = os.environ.get("COMTRADE_KEY")
        if not key:
            raise SystemExit("COMTRADE_KEY environment variable is not set")
        raw = build_live(key)
        raw["_checksum"] = hashlib.sha256(
            json.dumps(raw["countries"], sort_keys=True).encode()).hexdigest()
    regimes = scope["regimes"]
    today = date.today().isoformat()

    out = {
        "dataset_version": raw.get("dataset_version", "sample-0"),
        "generated": today, "sample_data": raw.get("sample", True),
        "vintage": raw.get("vintage", "SAMPLE"), "sources": raw.get("sources", []),
        "input_checksums": {"flows": raw["_checksum"], "law_scope": scope["_checksum"]},
        "mapping_version": scope["mapping_version"],
        "assumptions": scope["assumptions"],
        "countries": {},
    }
    rows = [["country", "year", "union_central", "border", "diligence", "disclosure"]]
    for slug, flows in raw["countries"].items():
        T = flows["total_exports_usd"]
        series = []
        for y in YEARS:
            on = f"{y}-12-31"
            u = cell_coverage(regimes, flows, on) / T
            mech = {m: cell_coverage(regimes, flows, on, m) / T for m in MECHS}
            series.append({"year": y, "union": round(u, 4), **{m: round(v, 4) for m, v in mech.items()}})
            rows.append([slug, y, round(u, 4)] + [round(mech[m], 4) for m in MECHS])
        reg_out, touching = {}, 0
        for r in regimes:
            vals = regime_values(r, flows, "2030-12-31")
            if vals is None:
                reg_out[r["slug"]] = {"class": "C"}
                continue
            lo, c, hi = vals
            if c > 0 or hi > 0: touching += 1
            reg_out[r["slug"]] = {
                "class": r["class"], "mechanism": r["mechanism"], "market": r["market"],
                "first_date": min((s["date"] for s in r.get("steps", [])), default=None),
                "share": [round(lo/T, 4), round(c/T, 4), round(hi/T, 4)],
                "value": [round(lo, 0), round(c, 0), round(hi, 0)],
                "assumption": r.get("assumption"), "indicator": r.get("indicator"),
            }
        msum = [{"key": k, "total": m["total"], "share": round(m["total"]/T, 4)}
                for k, m in flows["markets"].items()]
        msum.sort(key=lambda x: -x["total"])
        out["countries"][slug] = {
            "name": flows["name"], "total_exports_usd": T,
            "laws_touching": touching, "markets": msum,
            "member_shares": flows.get("member_shares", {}),
            "series": series, "regimes_2030": reg_out,
        }
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    json.dump(out, open(OUT_JSON, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    csv.writer(open(OUT_CSV, "w", newline="", encoding="utf-8")).writerows(rows)
    print(f"wrote {len(out['countries'])} countries, sample={out['sample_data']}")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--sample", action="store_true"); ap.add_argument("--live", action="store_true")
    a = ap.parse_args(); build("live" if a.live else "sample")
