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
    "bangladesh": "050", "india": "356", "vietnam": "704", "indonesia": "360",
    "brazil": "076", "thailand": "764", "ethiopia": "231", "kenya": "404",
    "ghana": "288", "cote-divoire": "384",
}

# M49 codes for tracked markets. The EU27 has no single reliable bilateral
# partner code across all reporters in Comtrade, so it is queried as the sum
# of its 27 member states rather than one aggregate call.
MARKET_M49 = {
    "USA": "842", "GBR": "826", "CAN": "124", "AUS": "036",
    "NOR": "578", "CHE": "756", "JPN": "392", "KOR": "410",
}
EU27_M49 = {
    "AUT": "040", "BEL": "056", "BGR": "100", "HRV": "191", "CYP": "196",
    "CZE": "203", "DNK": "208", "EST": "233", "FIN": "246", "FRA": "251",
    "DEU": "276", "GRC": "300", "HUN": "348", "IRL": "372", "ITA": "380",
    "LVA": "428", "LTU": "440", "LUX": "442", "MLT": "470", "NLD": "528",
    "POL": "616", "PRT": "620", "ROU": "642", "SVK": "703", "SVN": "705",
    "ESP": "724", "SWE": "752",
}

CHAPTERS = ['01','02','03','09','12','15','16','18','20','26','28','38','39',
    '40','44','47','48','50','51','52','53','54','55','56','57','58','59',
    '60','61','62','63','71','76','85','94']

def comtrade_get(params, key, retries=4):
    """Single GET against the Comtrade v1 data API, with the subscription key
    header and exponential backoff on transient failures. Raises on the final
    attempt so a real error surfaces rather than being silently swallowed."""
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
                time.sleep(2 ** attempt * 3)
                continue
            raise SystemExit(
                f"Comtrade API error {e.code} on reporter={params.get('reporterCode')} "
                f"partner={params.get('partnerCode')}: {body}")
        except urllib.error.URLError as e:
            if attempt < retries - 1:
                time.sleep(2 ** attempt * 3)
                continue
            raise SystemExit(f"Comtrade network error: {e}")
    raise SystemExit("Comtrade API exhausted retries without a response")

def latest_available_year(reporter_m49, key):
    """Comtrade's final annual data lags by roughly 12-18 months. Walk back
    from the current year until the reporter has a World-partner export total,
    and return both the year and that total so the caller does not need to
    repeat the same call. This also keeps the run inside the free-tier
    daily call limit, which the full pull approaches."""
    this_year = date.today().year
    for y in range(this_year - 1, this_year - 5, -1):
        data = comtrade_get({
            "reporterCode": reporter_m49, "period": str(y), "partnerCode": "0",
            "cmdCode": "TOTAL", "flowCode": "X", "breakdownMode": "classic",
        }, key)
        rows = data.get("data", [])
        if rows:
            return y, float(rows[0]["primaryValue"])
    raise SystemExit(f"No recent annual data found for reporter {reporter_m49} in the last 4 years")

def fetch_country_flows(slug, reporter_m49, key, year, total):
    """Build one country's flows entry: per-market totals and per-market
    HS2-chapter breakdown for EU27 and USA (the two markets with
    product-level regime scope in law_scope.json). The world-export total
    arrives from the year-discovery call rather than being refetched."""
    if total <= 0:
        raise SystemExit(f"Reporter {reporter_m49} returned zero world exports for {year}, cannot proceed")

    markets = {}

    # non-EU markets: total value, no HS breakdown needed except USA
    for mkey, m49 in MARKET_M49.items():
        data = comtrade_get({
            "reporterCode": reporter_m49, "period": str(year), "partnerCode": m49,
            "cmdCode": "TOTAL", "flowCode": "X", "breakdownMode": "classic",
        }, key)
        rows = data.get("data", [])
        markets[mkey] = {"total": float(rows[0]["primaryValue"]) if rows else 0.0}

    # USA by_hs4: needed because UFLPA scope is chapter-level within the US market
    us_chap = comtrade_get({
        "reporterCode": reporter_m49, "period": str(year), "partnerCode": MARKET_M49["USA"],
        "cmdCode": "AG2", "flowCode": "X", "breakdownMode": "classic",
    }, key)
    us_by_chapter = {}
    for row in us_chap.get("data", []):
        code = str(row.get("cmdCode", "")).zfill(2)
        if code in CHAPTERS:
            us_by_chapter[code + "00"] = float(row["primaryValue"])
    if us_by_chapter:
        markets["USA"]["by_hs4"] = us_by_chapter

    # EU27: sum member totals, and sum member HS2 chapter breakdowns for EUDR/Batteries scope
    eu_total = 0.0
    eu_by_chapter = {}
    for member_iso, member_m49 in EU27_M49.items():
        mdata = comtrade_get({
            "reporterCode": reporter_m49, "period": str(year), "partnerCode": member_m49,
            "cmdCode": "TOTAL", "flowCode": "X", "breakdownMode": "classic",
        }, key)
        rows = mdata.get("data", [])
        mtotal = float(rows[0]["primaryValue"]) if rows else 0.0
        eu_total += mtotal
        time.sleep(0.3)  # stay well under free-tier rate limits across 27 sequential calls
    markets["EU27"] = {"total": eu_total}

    eu_chap = comtrade_get({
        "reporterCode": reporter_m49, "period": str(year), "partnerCode": "97",  # EU aggregate, chapter-level only
        "cmdCode": "AG2", "flowCode": "X", "breakdownMode": "classic",
    }, key)
    for row in eu_chap.get("data", []):
        code = str(row.get("cmdCode", "")).zfill(2)
        if code in CHAPTERS:
            eu_by_chapter[code + "00"] = float(row["primaryValue"])
    if eu_by_chapter:
        markets["EU27"]["by_hs4"] = eu_by_chapter

    return {
        "name": slug.replace("-", " ").title(),
        "total_exports_usd": total,
        "markets": markets,
        "member_shares": {},  # not computable from chapter-level pull; left for a future refinement
    }

def build_live(key):
    country_flows = {}
    for slug, m49 in ORIGIN_M49.items():
        year, world_total = latest_available_year(m49, key)
        country_flows[slug] = fetch_country_flows(slug, m49, key, year, world_total)
        print(f"fetched {slug}: {year}, total=${country_flows[slug]['total_exports_usd']:,.0f}")
    return {
        "sample": False,
        "dataset_version": f"comtrade-live-{date.today().isoformat()}",
        "vintage": "UN Comtrade final annual data, most recent available year per reporter",
        "sources": [
            "UN Comtrade Database, https://comtradeplus.un.org",
            "EU27 members summed bilaterally; EU aggregate (partner 97) used for chapter-level breakdown only",
        ],
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
