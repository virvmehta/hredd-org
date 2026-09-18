# hredd.org — project context for Claude

## What this is
An independent tracker of HREDD (human rights and environmental due diligence)
legislation, written for suppliers in the Global South rather than the buyers
and law firms most trackers target. Currently covers 18 laws (CSDDD, EUDR,
CSRD, UFLPA, LkSG, and 13 others), plus a trade exposure tool, a buyer mapping
tool, a supplier exposure report generator, and long-form articles.

## Who you're working with
Vir is non-technical. He does not have Python installed locally and works on
Windows. He copies files via File Explorer, not git merges of individual
files — **always tell him to delete the target folder before pasting a
replacement**, since merge-pasting silently fails on Windows for folder
structures. When giving deploy instructions, give exact PowerShell commands,
not just "run the build."

PowerShell-specific gotcha: square brackets in filenames (e.g.
`[slug].astro`) are wildcard characters to `Test-Path` and similar cmdlets.
Use `-LiteralPath` or `Get-ChildItem` instead of a plain `Test-Path` on any
path containing brackets.

## Stack
- **Astro v5**, static output, deployed via **Cloudflare Pages**
- **Sanity CMS**, project ID `jw8lakl8`, dataset `production`
- Repo: `github.com/virvmehta/hredd-org`, branch `main`
- GitHub Actions workflow (`.github/workflows/trade-data.yml`) refreshes trade
  data on a schedule and via manual trigger

## Content architecture: Sanity + static fallback, merged per-item
Laws and articles are meant to live in Sanity, but Sanity is being populated
gradually, one document at a time. `src/lib/sanity.js` merges Sanity results
with `src/lib/staticData.js` **by slug**, not as an all-or-nothing swap: any
law with a published Sanity document uses that document, any law without one
falls back to the static entry. This was a real bug once (an all-or-nothing
fallback silently dropped 17 of 18 law pages when only one Sanity document
existed) — do not regress to a "if Sanity returns anything, ignore static
entirely" pattern.

State as of September 2026: **4 of 18 laws** live in Sanity (CSDDD, EU FLR,
Loi de Vigilance, UK MSA); the other 14 are static entries in
`staticData.js`. **Articles come entirely from Sanity.** Unlike laws, articles
are not merged per item: `staticArticles` is only used if Sanity returns
nothing or is unreachable, and those four static articles are out of date
(one still claims the CSDDD climate transition plan duty survived).

`useCdn: false` on the Sanity client is intentional, not an oversight. Builds
are infrequent, so freshness matters more than CDN speed, and `useCdn: true`
previously caused a freshly-published Sanity edit to not appear for several
minutes after a webhook-triggered rebuild.

## Editing Sanity from scripts
- A write token lives in `.env.local` as `SANITY_WRITE_TOKEN`. That file is
  gitignored; `.env` is **tracked**, so a token must never go there. Never
  print the token; read it inside the script.
- Patch with `@sanity/client` (already in `node_modules`), using
  `ifRevisionId` so a patch fails rather than overwriting an edit Vir made in
  Studio since the document was read. Dry run first, then write.
- Any API mutation to a published document fires the Cloudflare rebuild
  webhook, so a published patch goes live within about 90 seconds.
- Create new articles as **drafts** (`_id: "drafts.<uuid>"`) so Vir reviews
  and publishes them in Studio himself.
- Links inside portable text must be absolute (`https://hredd.org/laws/...`),
  not relative; the Studio link field rejects relative URLs.
- `status` must be one of the labels in `studio/schemas/trackerLaw.js`;
  `statusType` (`force`, `pending`, `proposed`, `delayed`) controls the
  grouping and tag colour. An act in force with reform pending is
  `force` / "Reform proposed", not `proposed`.

## Monthly law update routine
1. Research every tracked law against primary sources or named law firm
   trackers, and list the proposed changes for Vir **before** editing.
2. For each changed law: set `lastUpdated`, rewrite `tableUpdateText`, add
   dated timeline entries, prepend a changelog entry dated "Month YYYY", and
   add a source for every new fact. Also reread `summary` and `obligations`,
   because stale dates hide there (the EUDR summary once still gave 2025
   start dates after two postponements).
3. The homepage "What changed this month" block shows the three laws with the
   most recent `lastUpdated`; ties fall back to the `order` field.
4. Anything that cannot be verified stays unchanged and is reported as
   unverified, never guessed.

Open items as of 18 September 2026: whether Germany's LkSG amendment has
passed (the static summary already says the reporting duty "was removed in
2025", which may overstate it); whether the EU battery due diligence
guidelines due 26 July 2026 were published; and Official Journal publication
of the July 2026 EUDR delegated act removing leather. Once that act is
published, relabel "Cattle or leather" in `src/lib/sectorChapters.js` and
`src/pages/report/index.astro`. The trade figures are unaffected either way,
because HS chapter 41 was never in the EUDR scope set.

## Translations (Bangla pilot, on hold)
`src/pages/bn/` is deliberately **untracked** and must not be committed until
a fluent speaker reviews the draft strings in `src/lib/i18n.js`. Vir has
asked to ignore translations for now. While that folder exists, stage files
by explicit path rather than `git add .`.

## Design system
- Serif: **Newsreader** (editorial headlines, articles)
- Interface font: **Space Grotesk** (nav, labels, UI chrome) — not a generic
  default, deliberately chosen to replace IBM Plex Mono and Archivo
- Wordmark: typographic only, `hredd.org` set in the serif with a gold
  underscore beneath "hredd" only, `.org` recedes in a fainter tone. No ring
  or symbol logo — that was explicitly replaced.
- Palette: near-black background, warm off-white ink, gold accent
- British spelling throughout, no em or en dashes, **no sentence under seven
  words** — this is a hard content rule Vir enforces everywhere, including
  casual responses and generated copy

## The trade exposure pipeline (`pipeline/`)
`pipeline/compute.py` computes exposure using **mirror statistics**: it asks
destination markets what they imported from each origin country, not what
the origin country self-reported, because several tracked origins
(Bangladesh among them) report to UN Comtrade irregularly or not at all.

Hard-won lessons, do not relitigate these:
- `reporterCode=0` does **not** work as an "all reporters" wildcard on the
  `get` endpoint, even though `partnerCode=0` works fine as an "all partners"
  wildcard. Total exposure is derived by summing the tracked markets instead.
- Comtrade's own country codes sometimes diverge from the M49 statistical
  standard for historical reasons. India is **699**, not the M49-standard
  356 (which Comtrade retired after Sikkim's 1975 merger). Always verify a
  new country code against `comtradeapi.un.org/files/v1/app/reference/
  partnerAreas.json` rather than the M49 standard alone.
- M49-style codes are zero-padded (e.g. Bangladesh as `050`) but Comtrade's
  API wants them unpadded (`50`). `_normalize_codes()` in compute.py handles
  this defensively — don't remove it.
- Free tier is **500 calls/day**, shared across every attempt that day,
  successful or failed. Don't trigger the workflow repeatedly while debugging
  in the same day — it silently exhausts the quota for the rest of the day
  with no warning until the quota is actually gone.
- `reporterCode`, `partnerCode` and `cmdCode` all accept **comma-separated
  batched lists** on the `get` endpoint (verified against the keyless public
  preview endpoint, 2026-07-15). Batching all ten origins per call cut a full
  run from roughly 390 calls to roughly 42. Note that responses **truncate
  silently** at the record cap, and the `count` field reports only the rows
  returned, not the true total — keep responses small (request only tracked
  chapters, never AG2) and keep the `MAX_RECORDS` guard in `_rows_by_origin`.
- EU27 totals sum all 27 member states; the EU chapter-level product mix
  (used for EUDR/Batteries scope) is approximated from the four largest EU
  importers (Germany, France, Netherlands, Italy), not all 27, to keep call
  budgets sane. This is stated honestly in the dataset's `vintage` field,
  not hidden.
- The GitHub Actions workflow must **never run `test_mapping.py` after the
  live fetch**: that script regenerates sample data into `public/data/` as a
  side effect and clobbers the live output. It once caused a "successful"
  run to commit sample data.

## Testing, always run before calling anything done
```
python pipeline/compute.py --sample
python pipeline/test_mapping.py
```
Both must pass before any pipeline change is considered finished. `ALL TESTS
PASS` is the expected final line of the second command.

## Deploy checklist
1. `npm run build` locally (or trust the CI build) — check the page count in
   the output against what's expected (currently 74 pages in production, 75
   locally while the untracked Bangla page exists)
2. `git add <paths> && git commit -m "..." && git push` (explicit paths, see
   the translations note above)
3. Cloudflare rebuilds automatically on push, ~90 seconds
4. For Sanity content changes: republishing a document re-triggers the
   webhook and rebuild even with no changes, useful for testing a fix to the
   fetch layer itself

## Favicon / brand assets
Must be a square PNG at a multiple of 48px (Google's stated requirement).
Current is 480×480 plus a 96×96 variant and a multi-size .ico. If regenerating,
verify `width % 48 == 0` before shipping — this was gotten wrong once (512px,
not a multiple of 48) and shipped before being checked.

## Accuracy is the top priority
This is a legal tracker; a wrong compliance date is much worse than any other
kind of bug. Any change to a law's dates, status, or deadlines should be
verified against a primary source (EUR-Lex, national gazette, or a named law
firm tracker) before being treated as correct, not assumed from training
data or a prior draft.
