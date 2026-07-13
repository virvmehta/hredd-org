#!/usr/bin/env python3
"""v2 test suite: mapping integrity, class rules, band rules, and output invariants."""
import json, os, sys, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))
scope = json.load(open(os.path.join(HERE, "law_scope.json"), encoding="utf-8"))
fails = []
def check(n, c):
    if not c: fails.append(n); print("FAIL " + n)

aids = {a["id"] for a in scope["assumptions"]}
for r in scope["regimes"]:
    s = r["slug"]
    check(f"{s}: class valid", r["class"] in "ABC")
    check(f"{s}: mechanism valid", r["mechanism"] in ("border","diligence","disclosure"))
    check(f"{s}: legal source url", r["legal_source_url"].startswith("https://"))
    check(f"{s}: granularity declared", bool(r.get("granularity")))
    if r["class"] == "A":
        check(f"{s}: A has no band", "band" not in r and "band_mode" not in r)
    if r["class"] == "B":
        check(f"{s}: B has assumption", r.get("assumption") in aids)
        check(f"{s}: B has named indicator", bool(r.get("indicator")))
        if r.get("band"):
            lo, c, hi = r["band"]
            check(f"{s}: band ordered", 0 < lo <= c <= hi <= 1)
        else:
            check(f"{s}: band or band_mode", r.get("band_mode") == "priority_to_all")
    if r["class"] == "C":
        check(f"{s}: C has no scope", r["scope"] == "none")
    if r.get("scope") == "product":
        check(f"{s}: product scope has chapters", len(r.get("chapters", [])) > 0)
    for st in r.get("steps", []):
        check(f"{s}: step date ISO", len(st["date"]) == 10)

eudr = next(r for r in scope["regimes"] if r["slug"]=="eu-deforestation-regulation")
for fam, chap in {"cattle":"01","coffee":"09","palm":"15","cocoa":"18",
                  "rubber":"40","wood":"44","pulp":"47","furniture":"94"}.items():
    check(f"EUDR chapter covers {fam}", chap in eudr["chapters"])
uflpa = next(r for r in scope["regimes"] if r["slug"]=="us-uflpa")
for sec, chap in {"cotton":"52","apparel":"61","tomatoes":"20","polysilicon":"28",
                  "electronics-solar":"85","pvc":"39","aluminium":"76","seafood":"03"}.items():
    check(f"UFLPA priority chapter covers {sec}", chap in uflpa["priority_chapters"])
check("18 regimes mapped", len(scope["regimes"]) == 18)
for r in scope["regimes"]:
    if r.get("scope") == "product":
        check(f"{r['slug']}: chapters are 2-digit", all(len(c)==2 for c in r["chapters"]))
    if r.get("scope") == "priority":
        check(f"{r['slug']}: priority chapters 2-digit", all(len(c)==2 for c in r["priority_chapters"]))
    if r.get("scope") in ("product","priority"):
        check(f"{r['slug']}: has scope_note", bool(r.get("scope_note")))

subprocess.run([sys.executable, os.path.join(HERE,"compute.py"), "--sample"], check=True, capture_output=True)
out = json.load(open(os.path.join(HERE,"..","public","data","trade-exposure.json"), encoding="utf-8"))
check("sample flagged", out["sample_data"] is True)
check("assumptions embedded", len(out["assumptions"]) == 6)
for slug, c in out["countries"].items():
    for p in c["series"]:
        check(f"{slug} {p['year']}: union <= mech sum", p["union"] <= p["border"]+p["diligence"]+p["disclosure"] + 1e-9)
        check(f"{slug} {p['year']}: union <= 1", p["union"] <= 1)
    u = [p["union"] for p in c["series"]]
    check(f"{slug}: monotonic", all(a <= b + 1e-9 for a, b in zip(u, u[1:])))
    for rslug, rv in c["regimes_2030"].items():
        if rv.get("class") == "C":
            check(f"{slug}/{rslug}: C carries no values", "share" not in rv)
        else:
            lo, cc, hi = rv["share"]
            check(f"{slug}/{rslug}: band ordered", lo <= cc <= hi)
            check(f"{slug}/{rslug}: share sane", 0 <= hi <= 1)
print("ALL TESTS PASS" if not fails else f"{len(fails)} FAILURES")
sys.exit(1 if fails else 0)
