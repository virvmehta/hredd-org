# hredd.org

Tracking global HREDD legislation and its implications for those most
affected and least consulted. Built with Astro, Sanity and Cloudflare
Pages. This is the full April 2026 rebuild with all Round 2 fixes
included, generated in July 2026.

## What is in this repository

The Astro site lives at the root and builds 47 static pages: the
homepage, the tracker with a server-rendered Equal Earth world map, 18
law detail pages at /laws/[slug] with redirects preserved from the old
/tracker/[slug] routes, the articles index and article pages, the buyer
compliance mapping page, about, and subscribe. The Sanity Studio lives
in the studio folder with schemas for articles, tracker laws and site
settings, including the excerpt, deck and articleDisclaimer fields.

Content is fetched from Sanity project jw8lakl8 (dataset production) at
build time. If Sanity is unreachable or empty, the build falls back to
the static launch content in src/lib/staticData.js, so a broken CMS
connection can never produce a broken deployment.

## Deploying the site (do these steps in order)

### Step 1: Replace the code in your existing repository

Unzip this project, then copy everything into your local hredd-org
folder, replacing the old files. From PowerShell:

    cd "C:\Users\Vir Mehta\hredd-org"
    git add .
    git commit -m "Full rebuild with Round 2 fixes"
    git push

Cloudflare Pages will detect the push and rebuild automatically. The
build settings are unchanged: build command `npm run build`, output
directory `dist`, Node version 18 or higher.

### Step 2: Redeploy the Sanity Studio

The article schema gained the excerpt and deck fields, and site
settings gained the articleDisclaimer field, so the Studio must be
redeployed once:

    cd "C:\Users\Vir Mehta\hredd-org\studio"
    npm install
    npx sanity deploy

The hostname hredd-org is already configured in sanity.cli.js, so it
should deploy without prompting.

### Step 3: Fill in the new fields in Sanity

1. Open https://hredd-org.sanity.studio
2. Open Site Settings and write the article disclaimer.
3. Open each article and fill in the excerpt (card text, max 220
   characters) and the deck (subtitle on the article page, max 280
   characters), then publish.
4. Publishing triggers the Cloudflare rebuild webhook; the live site
   updates within about ninety seconds.

### Step 4: Check the live site

Visit https://hredd-org.pages.dev and confirm the new three-line
masthead, the excerpt and deck on articles, the world map on the
tracker, and the buyer mapping page.

## Content rules baked into this build

British spelling is used throughout all copy. No em dashes or en dashes
appear anywhere in code, content or copy, and this rule applies to all
future content as well. Every tracker entry carries a changelog and at
least one primary source.

## Local development

    npm install
    npm run dev        # site at localhost:4321

    cd studio
    npm install
    npm run dev        # studio at localhost:3333
