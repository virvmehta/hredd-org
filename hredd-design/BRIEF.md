# hredd.org — Claude Code Handoff Brief

> LANGUAGE NOTE: English only. Ignore all i18n references in this 
> document and in the JSX files. No language switcher. No EN/ES/PT.

> Build the production hredd.org website in Astro + Sanity, using these
> HTML/JSX mocks as the design source of truth.

This package is the design reference for **hredd.org**, an independent
publication on human-rights and environmental due-diligence (HREDD)
legislation, written from a Global South perspective. The package
contains eight fully-designed page templates, the design tokens that
underpin them, and the component logic that makes each page work.

Read this brief end-to-end before opening any of the HTML files. It
explains how to translate the mocks into your Astro stack without
losing the editorial system the design is built around.

---

## 1 · The stack you are building into

| Layer | Choice |
|---|---|
| Framework | **Astro 5+** with islands for interactivity |
| CMS | **Sanity Studio** (separate `studio/` workspace) |
| Hosting | **Cloudflare Pages** |
| Languages | **English, Spanish, Portuguese** — three-edition site |
| Forms | Email capture goes to **Buttondown** (or a comparable transactional sender) |
| Maps | **d3-geo** + **world-atlas TopoJSON** (already used in mocks) |
| Type | Google Fonts: **EB Garamond**, **Inter**, **JetBrains Mono** |

If any of these is missing from the user's Astro repo, ask before
making a substitution.

---

## 2 · How to read this package

```
hredd-design-package/
├─ BRIEF.md                 ← this document, read first
├─ styles/
│   └─ tokens.css           ← design tokens. lift verbatim into Astro.
├─ Homepage.html            ← page templates, one per route
├─ Tracker.html
├─ Law.html
├─ Articles.html
├─ Article.html
├─ BuyerMapping.html
├─ About.html
├─ Subscribe.html
└─ src/
    ├─ Homepage.jsx          ← React components for each page
    ├─ Tracker.jsx           (read these for layout grammar &
    ├─ Law.jsx                section structure — they are not
    ├─ Articles.jsx           production code)
    ├─ Article.jsx
    ├─ BuyerMapping.jsx
    ├─ About.jsx
    └─ Subscribe.jsx
```

Each `*.html` file contains the page-specific styles in a `<style>`
block at the top, then loads the matching `*.jsx` from `src/`. The HTML
shell + the JSX file together describe one page; treat them as a pair.

> **Open every file once** before starting the Astro build. The mocks
> will tell you things this brief cannot — exact spacing, hairline
> rules, type scale, hover affordances.

---

## 3 · The design system

### 3.1 · Identity, in one paragraph

hredd.org reads as an editorial publication — closer to *Granta* or
*The Baffler* than to a SaaS product. It is built on warm cream paper
(`#EEE9DD`), dark ink (`#161210`), one accent of burnt sienna
(`#B8460E`), three typefaces, and hairline rules. There are no
shadows, no rounded cards, no gradient surfaces. Sienna is rationed —
it is used for emphasis, not decoration.

### 3.2 · Color tokens

Lift `styles/tokens.css` into your Astro project verbatim
(e.g. as `src/styles/tokens.css` imported from the root layout). The
canonical values:

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#EEE9DD` | Page background |
| `--bg-warm` | `#E8E2D2` | Card / scenario fills, alt rows |
| `--ink` | `#161210` | Headings, primary text, 2px hairlines |
| `--ink-2` | `#4A3F32` | Body text |
| `--ink-3` | `#6B5D4F` | Meta, byline, captions |
| `--rule` | `#B6AB94` | 1px hairline rules |
| `--rule-soft` | `#D8CFB8` | Tertiary hairlines, table rows |
| `--accent` | `#B8460E` | Eyebrows, in-force status, italic accents, links |
| `--accent-ink` | `#8E3508` | Accent on hover / pressed |
| `--dark-fill` | `#3D332B` | Map fill — countries with laws on books |
| `--light-fill` | `#D8CFB8` | Map fill — countries without laws |

### 3.3 · Type system

| Family | Use |
|---|---|
| **EB Garamond** | All headlines, decks, body, pull quotes, large stats. Italic + sienna for editorial emphasis. |
| **Inter** | Nav, eyebrows, meta, labels, byline, footer. ALL CAPS with letter-spacing 0.12–0.22em. |
| **JetBrains Mono** | Image captions, source citations (LkSG §5), numerals in tables, small editorial flourishes. |

**Type rules:**
- Headlines use `font-weight: 400` (Garamond is heavy enough).
- Apply `text-wrap: balance` to every H1/H2 and `text-wrap: pretty` to
  body paragraphs and decks.
- Italic + sienna `<em>` is the canonical editorial emphasis. Use it
  on the second-most-important word of a headline, never on whole
  sentences.
- Mono numerals on stats columns and table cells (use
  `font-feature-settings: "tnum"` if you want strict tabular figures).

### 3.4 · Layout grammar

Every interior page follows the same backbone:

1. **Top strip** — Vol/issue + utility links, 11px Inter caps,
   1px rule below.
2. **Nav** — `1fr auto 1fr` grid: Home + Tracker on the left,
   `hredd·org` lockup centered (36px Garamond, sienna `·` glyph),
   Buyer Mapping / Articles / About / Subscribe on the right.
   2px ink rule below.
3. **Page header** — `1.8fr 1px 1fr` grid with a vertical hairline
   between. Title + lede on the left, stats column on the right
   (homepage uses 1.45fr/1px/1fr; otherwise 1.8fr/1px/1fr).
4. **Content sections** — separated by 1px or 2px ink rules.
   Section starters always lead with a sienna eyebrow label.
5. **Footer** — 2px ink rule above; colophon on left, links on right;
   simple Inter caps.

The **vertical hairline divider** is the single most repeated visual
device on the site. It appears in the homepage masthead, the Latest
module, the Tracker section, the Article body grid, the About people
section, the BuyerMapping breakdown, and the Subscribe summary. Build
it as a reusable component (`<HairlineDivider />`) — it's just
`<div class="v"></div>` with `background: var(--rule); width: 1px`.

### 3.5 · Spacing rhythm

Pad pages with `var(--pad-x)` (56px) on the left and right.
`max-width: 1366px` on the outer container.

Section vertical rhythm: the basic unit is **56px** (`padding: 56px 0`).
Larger introductions use 64–80px, smaller dividers 32–40px.

---

## 4 · The eight page templates

For each page below, the section list is the order of components on
the page, top to bottom. Build each section as a separate Astro
component under `src/components/<page>/`.

### 4.1 · `Homepage.html` → `/`

| Section | Notes |
|---|---|
| TopStrip | Persistent across all pages |
| Nav | Persistent across all pages |
| Masthead | 3-line H1 with middle line italic-sienna ("Human rights / *& environmental* / due diligence"). 1.45fr/1px/1fr grid. "This month" stats on the right. |
| Latest | Section title "Latest · *April*". 1 lead article (with hero figure) + 3 stacked secondaries on the right. Hairline-divided. |
| Tracker teaser | 6 rows of laws + an editorial pull quote on the right. Mirrors the layout of the Latest module so the page has rhythm. |
| Subscribe band | Large serif "Subscribe to the fortnightly letter" with an inline email capture. **NB: Subscribe.html is a dedicated page; this band echoes it.** |
| Footer | Mini-masthead lockup + 3 columns of links + colophon |

### 4.2 · `Tracker.html` → `/tracker`

| Section | Notes |
|---|---|
| Page header | "A working ledger of HREDD statutes on the books" with sienna emphasis. 1.8fr/1px/1fr grid; "As of April 2026" stats on right. |
| Date banner | Full-width sienna band, hairline-bounded: `UPDATED · 14 APRIL 2026 · NEXT UPDATE · 12 MAY 2026 · → SIGN UP FOR CHANGELOG`. |
| Map block | 16:9 SVG world map (d3-geo + world-atlas TopoJSON). Dark fill = laws on books, light fill = none. Hover → sienna highlight, click → populate detail panel. Defaults to Germany. Mono caption "NATURAL EARTH PROJECTION · 1:120M" bottom-right. |
| Detail panel | Right of map, hairline-divided. Country name in serif, statute count, list of laws by year/name/status. |
| Ledger | Full table of all 18+ laws with filter pills (All / In force / Pending / Proposed). 110px right-aligned status column. Italic-serif scope description. |
| Footer | Compact: colophon + utility links above 2px rule. |

**Map data:** the mock loads world-atlas via CDN. In production, vendor
the TopoJSON locally and hydrate the map as an Astro island.

### 4.3 · `Law.html` → `/laws/[slug]`

| Section | Notes |
|---|---|
| Page header | Statute name (huge serif), native-language title beneath, deck. Right column: jurisdiction, year, status, scope. |
| Quick facts band | 5-cell grid of `Status · Enacted · In force · Enforcement body · Penalty cap`. |
| Body | 2-col: scope + key provisions on left, italic-serif "what this law actually says" pull quotes on right. |
| Timeline | Hairline-divided dates from draft → enactment → in-force → first enforcement actions. Mono dates. |
| Related laws | 3-card row of similar statutes by jurisdiction. |
| Related articles | Articles tagged with this law's slug. |
| Footer | |

### 4.4 · `Articles.html` → `/articles`

| Section | Notes |
|---|---|
| Page header | "The other end of the chain" with italic-sienna emphasis. 1.8fr/1px/1fr. |
| Category bar | Filter pills (All / Analysis / Field report / Interview / Commentary / Case study / Dispatch) + sort menu. |
| Lead row | 1 large article + 3 stacked secondaries (mirrors homepage Latest). |
| Archive | 5-column ledger rows: mono date / sienna category / serif title with italic-serif deck / byline / mono read time. ~10 rows then "Load more" sienna ghost button. |
| Footer | |

### 4.5 · `Article.html` → `/articles/[slug]`

| Section | Notes |
|---|---|
| Crumb | `HREDD / Articles / Analysis · April 2026` |
| Mast | Centered single column. 64px serif H1 with `text-wrap: balance`, italic deck, byline row (author / location / read time / date). |
| Hero figure | 16:8 placeholder frame with mono caption + photo credit. |
| Body grid | 1fr / 1px / 300px. Article body with sienna drop-cap on first paragraph, mono Roman-numeral H2s, italic blockquote with sienna left rule, inline figures. Sticky right rail with reading progress, related laws, continue-reading, citation block. |
| Author bio | 80px square avatar tile + serif name + serif copy + sienna "More from this author →". |
| Editorial disclosure | Centered. Use the canonical disclosure language verbatim — see §6 below. |
| Footer | |

### 4.6 · `BuyerMapping.html` → `/buyer-mapping`

| Section | Notes |
|---|---|
| Page header | "Which laws govern *your* chain?" 1.8fr/1px/1fr. |
| Tool band | "How this works" italic-serif explainer + sienna "UPDATED · …" meta on right. |
| Form | 3-column hairline-divided ledger: `Sells into / Sources from / Profile`. Pill tags for selected jurisdictions, italic placeholder text. Sienna primary submit on the right, separated by a hairline. |
| Summary | Mapped result: serif H2 stating count + meta line + 3-stat counts. |
| Matrix | The page's core. 18-row table: statute / jurisdiction / 7 obligation columns (vertical-rotated headers) / gap count. Filled-square / sienna-square / empty-square cells. "Watch-list" subsection in dimmed rows for non-applicable statutes. |
| Breakdown | 360px / 1px / 1fr grid. Left rail is a numbered list of the 7 obligations (active item sienna). Right side is the active obligation with cadence header, italic body explanation, and a 2-column "What is required / What is not" with mono source citations. |
| Worked example | Synthetic buyer profile in `<dl>` form, in a warm-fill card, with editorial commentary on the left. |
| CTA band | 2px-ruled. "Save this map. *Or, share it.*" + 3 buttons (Export PDF primary, Share private link, Alert me on changes). |
| Footer | |

### 4.7 · `About.html` → `/about`

| Section | Notes |
|---|---|
| Page header | "A publication on due diligence, *read from below*". Right column: colophon (founded, edited from, frequency, readership, languages). |
| Manifesto | Centered, max-width 880px. 4-paragraph editorial statement. Sienna drop-cap. Italic-sienna emphasis throughout. Centered "— The editors, Noida" signoff. |
| Pillars | "What we publish, *and how*". 4-up grid with mono 01–04 numerals, italic emphasis on the second word of each title. |
| People | 380px / 1px / 1fr. 2-col grid of 6 people with avatar tile + name + role caps + serif bio. |
| Methodology | 1fr / 1px / 1.5fr. Numbered ordered list (`decimal-leading-zero`) of 6 methodology rules. |
| Funding | "Reader-funded. *No grants. No advertising.* No editorial input from anyone." Use the canonical disclosure language. 3-up "Revenue source / What we do not accept / Editorial firewall". |
| Contact | 1.2fr / 1px / 1fr. Editorial copy on left, `<dl>` of department emails on right. |
| Footer | |

### 4.8 · `Subscribe.html` → `/subscribe`

A simple email-capture page — no payment tiers, no parity pricing,
no gift flow. Just the fortnightly letter signup.

| Section | Notes |
|---|---|
| Hero | Centered single column. 76px serif H1, italic-sienna emphasis on "*every other Friday*". 22px italic-serif lede. |
| Form | Hairline ledger form: email input + sienna "SUBSCRIBE →" button, separated by a 1px ink rule. 2px ink rules above and below. Microcopy beneath ("we use your email only to send the letter"). |
| Meta row | 3-cell hairline-bounded: subscriber count, issue cadence, language editions. |
| Sample | A short editorial preview of "the most recent issue" — H3 with quotes, byline meta, italic-serif excerpt, "Read this issue in full →" sienna link. |
| Footer | |

**Form integration:** wire the email input to your transactional
sender (Buttondown / equivalent). Confirmation should be a graceful
in-place state swap, not a route change.

---

## 5 · Sanity schemas

Build the studio with these document types (suggestions, expand as
your editor needs):

```ts
// site-settings (singleton)
{ vol, issueLabel, currentIssueNumber, contactEmails, footerLinks,
  topStripUtilityLinks, languages, languageDefault }

// law (Tracker entries + Law page)
{ slug, name, nativeName, jurisdiction, year, status,
  inForceDate, enforcementBody, penaltyCap, scope, deck,
  keyProvisions[], pullQuotes[], timeline[],
  relatedLaws[], relatedArticles[],
  obligationMap{ riskAnalysis, policyStatement, preventiveMeasures,
                 remedialMeasures, grievanceMechanism,
                 reporting, civilLiability } }

// article
{ slug, title, deck, category, byline{ author, location, readTime },
  publishedAt, hero{ image, caption, credit },
  body (rich text), inlineFigures[], relatedLaws[ ref → law ],
  relatedArticles[ ref → article ],
  disclosureOverride? }

// author
{ slug, name, role, bio, avatarInitials, photo? }

// translation (group object)
{ en, es, pt }   ← every translatable field is a group of these three
```

Use `@sanity/internationalization-plugin` or per-field grouping —
either is fine, but be consistent.

---

## 6 · The editorial disclosure (use verbatim)

This text is canonical. Place it on every Article page and on the
About page's Funding section. Do not paraphrase.

> hredd.org is an independent publication with no affiliation with any
> organisation, public or private. The views contained herein are
> personal. hredd.org is not funded by any organisation.

---

## 8 · Build order

I recommend tackling in this order — each step builds on the last:

1. **Tokens + base layout.** Lift `tokens.css`. Build the global
   layout (`<TopStrip>`, `<Nav>`, `<Footer>`). Wire i18n.
2. **About page.** Static, no data fetching, exercises the full type
   system + manifesto patterns.
3. **Sanity schemas + studio.** Define `law`, `article`, `author`,
   `siteSettings`. Seed with 3–5 of each.
4. **Articles index + Article page.** Wire the article documents.
5. **Tracker + Law page.** Wire the law documents. The map can come
   last — vendor world-atlas TopoJSON locally.
6. **Buyer Mapping.** This is the most data-heavy page. The matrix
   should read from the law documents' `obligationMap` field.
7. **Homepage.** Last, because it composes elements from every other
   page.
8. **Subscribe.** Wire to Buttondown.

---

## 9 · Things the mocks do that production must keep

These are easy to lose in translation. Don't.

1. **Sienna is rationed.** Used only for: eyebrows, italic emphasis in
   headlines, the `·` glyph in the lockup, "in-force" status, link
   affordances on hover, primary buttons. Never as a fill on large
   surfaces.
2. **Hairlines do all the structural work.** No boxes, no shadows, no
   rounded cards. 2px = section boundary, 1px = item boundary.
3. **The lockup never moves.** `hredd·org` is centered in the nav on
   every page, with the same `·` glyph in sienna italic.
4. **`text-wrap: balance` on every H1/H2.** It's how the editorial
   tone holds up at multiple widths.
5. **Italic + sienna emphasis on the second-most-important word.**
   Look at every H1 in the mocks: there is always one italicised word.
   It is what makes the type sing. Build a habit of it.
6. **Numerals are mono and right-aligned.** Tracker, Buyer Mapping,
   stats columns. Don't drift to Inter or Garamond figures here.
7. **Footer copy is "Built with care from Noida, India".** Do not
   change it without checking.

---

## 10 · Things the mocks do NOT do (and production should also not do)

- No emoji. None.
- No icons except occasional `→` `·` `/` glyphs typed inline.
- No drop-shadows, no rounded-corner cards, no gradients.
- No "Inter" headlines. EB Garamond owns every headline.
- No filler imagery — placeholder frames in the mocks are placeholders.
  Replace them with real commissioned photography or leave them as
  hairline-bordered figure cells with mono captions.

---

## 11 · Open questions for the user

When you start, confirm:

1. **CMS choice.** Is Sanity definitely the CMS? If they prefer
   Contentful, Storyblok, or a Markdown-first approach (Astro
   Content Collections), the schema in §5 needs adapting.
2. **Email sender.** Buttondown? Mailcoach? Substack-as-source-of-truth?
3. **Map provider.** d3-geo + world-atlas is what the mock uses. Other
   options: MapLibre vector tiles, Mapbox. d3-geo is recommended —
   it's lighter and matches the editorial aesthetic.
4. **Analytics.** None in the mocks. If they want analytics,
   Plausible or Fathom keeps the no-tracking ethos.
5. **Comment system.** Mocks have none. If they want one, ask.

---

## 12 · Final note

The visual restraint of this design is the design. It is what
distinguishes a publication from a content marketing site. When you
are tempted to add a hover effect, a card outline, a coloured
background, or an icon — don't. Trust the hairlines and the type.

Read every mock. Lift the tokens. Build the layout grammar first.
Everything else follows.

— design end of brief —
