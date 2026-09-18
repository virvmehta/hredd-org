# hredd.org

An independent tracker of human rights and environmental due diligence
(HREDD) legislation, written for suppliers in the Global South rather than
for the buyers and law firms that most trackers serve. Built with Astro,
Sanity and Cloudflare Pages, and developed independently by Vir Viraf Mehta.
See `LICENSE` for rights: the code, design and brand are proprietary, and
only the published dataset is licensed under CC BY 4.0.

## What the site contains

The site builds about 74 static pages:

- **Tracker** (`/tracker/`): all 18 laws on a world map, with the monthly
  change log. The old `/tracker/<law>/` addresses redirect to the law pages.
- **Law pages** (`/laws/<law>/`): status, deadlines, scope, penalties,
  obligations, a timeline, a change log and sources for every law.
- **Timelines** (`/timeline/` and `/timeline/<law>/`): the dates for each law.
- **Regulated Trade Index** (`/trade/`, `/countries/<country>/`,
  `/methodology/`): how much of each producing country's exports the laws
  reach, built from UN Comtrade data.
- **Buyer mapping** (`/buyer-mapping/`): which laws reach a supplier through
  each buyer country.
- **Exposure report** (`/report/`): a short questionnaire that produces a
  downloadable supplier exposure report.
- **Articles** (`/articles/`), **About**, **Subscribe**, and site search.

## Where the content lives

**Laws** are merged law by law. Any law with a published Sanity document uses
that document, and every other law uses its entry in `src/lib/staticData.js`.
As of September 2026, four laws are in Sanity (CSDDD, EU FLR, Loi de
Vigilance and UK MSA) and the other fourteen are in `staticData.js`.

**Articles** come from Sanity. The old static articles are only a fallback
for when Sanity cannot be reached, and they are out of date.

**Trade data** lives in `public/data/` and is produced by the Python pipeline
in `pipeline/`. A GitHub Actions workflow refreshes it every year on 15 July,
or whenever it is started manually from the Actions tab on GitHub.

The Sanity Studio is in the `studio` folder and is published at
https://hredd-org.sanity.studio (project `jw8lakl8`, dataset `production`).

## Publishing changes

**Content in Sanity:** edit the document in Studio and press Publish.
Publishing triggers a Cloudflare rebuild, and the live site updates in about
ninety seconds.

**Code or static law data:** commit and push from PowerShell. Name the files
you changed rather than using `git add .`, because the unfinished Bangla
pilot in `src/pages/bn/` must stay out of the repository for now.

    cd "C:\Users\Vir Mehta\hredd-org"
    npm run build
    git add src/lib/staticData.js
    git commit -m "Describe the change here"
    git push

Check that the build reports about 74 pages before you push. Cloudflare
rebuilds automatically once the push arrives.

**Sanity Studio schema changes** also need the Studio redeployed:

    cd "C:\Users\Vir Mehta\hredd-org\studio"
    npm install
    npx sanity deploy

## Sanity write token for scripted edits

A Sanity API token with Editor permission can be saved in `.env.local` as
`SANITY_WRITE_TOKEN`. That file is ignored by Git and never leaves this
computer. Never put a token in `.env`, because that file is committed to
GitHub. Delete the token under API, then Tokens, at
https://www.sanity.io/manage when it is no longer needed.

## Content rules

All copy uses British spelling. No em dashes or en dashes appear anywhere in
code, content or copy. No sentence is shorter than seven words. Every law
entry carries a change log and at least one source, and any change to a date,
status or deadline is checked against a primary source first.

## Local development

    npm install
    npm run dev        # site at localhost:4321

    cd studio
    npm install
    npm run dev        # studio at localhost:3333

The trade pipeline needs Python, which is only installed on the GitHub
Actions runner. Its tests are `python pipeline/compute.py --sample` and
`python pipeline/test_mapping.py`, and both must pass after any pipeline
change.
