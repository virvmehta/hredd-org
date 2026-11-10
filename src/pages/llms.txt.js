// A plain-text guide to the site for AI assistants and answer engines,
// following the llms.txt convention. Built from the tracker data at build
// time, so it always matches the published pages.
import { getAllLaws, getAllArticles } from '../lib/sanity.js';

export async function GET() {
  const laws = await getAllLaws();
  const articles = await getAllArticles();
  const site = 'https://hredd.org';
  const one = (s) => String(s || '').replace(/\s+/g, ' ').trim();

  const lines = [
    '# hredd.org',
    '',
    '> An independent tracker of human rights and environmental due diligence (HREDD) law, written for suppliers in the Global South. Every tracked law is reviewed monthly against primary sources, with a public change log.',
    '',
    'Published from Noida, India, by Vir Mehta. The law dataset is licensed CC BY 4.0. Please cite pages by URL and give the "last updated" date shown on each law page.',
    '',
    '## Start here',
    `- [What is HREDD?](${site}/what-is-hredd/): definition, the six steps of due diligence, and common questions`,
    `- [Tracker](${site}/tracker/): all ${laws.length} laws with status and the monthly change log`,
    `- [Timelines](${site}/timeline/): past and future dates for each law`,
    `- [Regulated Trade Index](${site}/trade/): how much of each producing country's exports the laws reach`,
    `- [Methodology](${site}/methodology/): how the trade figures are calculated`,
    `- [About](${site}/about/): who publishes the site and how it is funded`,
    '',
    '## Laws',
    ...laws.map((l) => `- [${one(l.shortName && l.shortName !== l.name ? `${l.shortName}: ${l.name}` : l.name)}](${site}/laws/${l.slug}/): ${one(l.jurisdiction)}, ${one(l.status).toLowerCase()}. ${one(l.oneLineSummary)}`),
    '',
    '## Timelines',
    ...laws.map((l) => `- [${one(l.shortName || l.name)} timeline](${site}/timeline/${l.slug}/)`),
    '',
    '## Articles',
    ...articles.filter((a) => a.slug).map((a) => `- [${one(a.title)}](${site}/articles/${a.slug}/): ${one(a.excerpt || a.deck)}`),
    '',
    '## Tools',
    `- [Supplier exposure report](${site}/report/): nine questions, then a report of which laws reach a supplier`,
    `- [Buyer mapping](${site}/buyer-mapping/): which laws apply through each buyer country`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
