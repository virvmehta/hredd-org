// Built once at site build time and fetched by the header search box, so
// search works entirely client-side with no backend: every law and article
// title, jurisdiction, and a short excerpt, indexed for simple substring
// matching. Small enough (well under 100KB for 18 laws + articles) to fetch
// once and keep in memory for the session.
import { getAllLaws, getAllArticles } from '../lib/sanity.js';

export async function GET() {
  const laws = await getAllLaws();
  const articles = await getAllArticles();

  const items = [
    ...laws.map((l) => ({
      type: 'law',
      title: l.shortName || l.name,
      sub: `${l.name} · ${l.jurisdiction}`,
      href: `/laws/${l.slug}/`,
      text: [l.name, l.shortName, l.jurisdiction, l.oneLineSummary, l.status]
        .filter(Boolean).join(' ').toLowerCase(),
    })),
    ...articles.map((a) => ({
      type: 'article',
      title: a.title,
      sub: `${a.category || 'Article'} · ${a.authorName || ''}`,
      href: `/articles/${a.slug}/`,
      text: [a.title, a.deck, a.excerpt, a.category].filter(Boolean).join(' ').toLowerCase(),
    })),
  ];

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json' },
  });
}
