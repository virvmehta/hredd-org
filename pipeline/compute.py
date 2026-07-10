#!/usr/bin/env python3
"""
hredd.org Trade Exposure Tracker pipeline, phase two.

Market model: each country's flows are split by destination market, with HS4
detail where a regime needs product scope. Class B regimes carry published
coverage bands; Class C regimes never receive values. Union and mechanism
decompositions are computed cell by cell so nothing double counts.
Design rules R1 to R5 unchanged, see /methodology/.
"""
import json, csv, hashlib, argparse, os
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
        prio = set(regime["priority_hs4"])
        prio_cells = {k: v for k, v in all_cells.items() if k.split(":")[1] in prio}
        return {"cells": all_cells, "priority_cells": prio_cells, "factors": "priority_to_all"}
    all_cells = cells_of(mk, flows)
    if regime["scope"] == "product":
        hs = set(regime["hs4"])
        all_cells = {k: v for k, v in all_cells.items() if k.split(":")[1] in hs}
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

def build(mode):
    scope = load("law_scope.json")
    raw = load(os.path.join("sample", "flows.json")) if mode == "sample" else None
    if raw is None:
        raise SystemExit("Live mode runs in the GitHub Action. Use --sample locally.")
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
