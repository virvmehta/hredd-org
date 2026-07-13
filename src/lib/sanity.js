import { createClient } from '@sanity/client';
import { toHTML } from '@portabletext/to-html';
import { staticLaws, staticArticles, staticSettings } from './staticData.js';

const projectId = import.meta.env.SANITY_PROJECT_ID || 'jw8lakl8';
const dataset = import.meta.env.SANITY_DATASET || 'production';

export const client = createClient({
  projectId,
  dataset,
  // useCdn:false so every build reads the live dataset directly rather than
  // a cached CDN copy. Builds are infrequent, so freshness matters far more
  // than shaving CDN latency, and a stale read here means a stale deploy.
  useCdn: false,
  apiVersion: '2024-01-01'
});

/**
 * Fetch from Sanity with a static fallback. The static data keeps the
 * build green when Sanity is unreachable or the dataset is empty, so a
 * broken CMS connection never produces a broken deployment.
 */
async function fetchWithFallback(query, fallback, label) {
  try {
    const result = await client.fetch(query);
    const isEmpty = result == null || (Array.isArray(result) && result.length === 0);
    if (isEmpty) {
      console.warn(`[sanity] Empty result for ${label}, using static fallback data.`);
      return fallback;
    }
    return result;
  } catch (err) {
    console.warn(`[sanity] Fetch failed for ${label} (${err.message}), using static fallback data.`);
    return fallback;
  }
}

import { queries } from './queries.js';

/* Memoise fetch promises so that every page and the shared layout can
   call these helpers freely during a build without refetching. */
let _laws, _articles, _settings;

export function getAllLaws() {
  if (!_laws) {
    _laws = fetchWithFallback(queries.allLaws, [], 'laws').then((sanityLaws) => {
      // Merge by slug rather than swap wholesale. This lets laws be migrated
      // into Sanity one at a time: any law with a published Sanity document
      // uses that document, and every law without one still falls back to
      // the static data, so the site is never missing pages mid-migration.
      const bySlug = new Map(staticLaws.map((l) => [l.slug, l]));
      for (const law of sanityLaws) {
        if (law?.slug) bySlug.set(law.slug, law);
      }
      return [...bySlug.values()].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    });
  }
  return _laws;
}

export function getAllArticles() {
  if (!_articles) {
    _articles = fetchWithFallback(queries.allArticles, staticArticles, 'articles').then(
      (articles) =>
        [...articles].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    );
  }
  return _articles;
}

export function getSiteSettings() {
  if (!_settings) {
    _settings = fetchWithFallback(queries.siteSettings, staticSettings, 'siteSettings');
  }
  return _settings;
}

/**
 * Render Sanity portable text to HTML. Static fallback content stores
 * body as an HTML string already, so pass strings straight through.
 */
export function renderBody(body) {
  if (!body) return '';
  if (typeof body === 'string') return body;
  return toHTML(body, {
    components: {
      types: {
        image: ({ value }) => {
          const ref = value?.asset?._ref || '';
          if (!ref) return '';
          const [, id, size, ext] = ref.split('-');
          const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${size}.${ext}`;
          const caption = value.caption ? `<figcaption>${value.caption}</figcaption>` : '';
          return `<figure><img src="${url}" alt="${value.alt || ''}" loading="lazy" />${caption}</figure>`;
        },
        dataBlock: ({ value }) => {
          const stats = [1, 2, 3]
            .map((n) => {
              const num = value[`stat${n}number`];
              const lab = value[`stat${n}label`];
              if (!num) return '';
              return `<div class="db-stat"><span class="db-num">${num}</span><span class="db-lab">${lab || ''}</span></div>`;
            })
            .join('');
          return `<div class="data-block">${stats}</div>`;
        }
      },
      marks: {
        link: ({ children, value }) =>
          `<a href="${value?.href || '#'}" rel="noopener">${children}</a>`
      }
    }
  });
}

/** Format a date string as "24 June 2026" style British dates. */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Format as "June 2026" for banners and strips. */
export function formatMonthYear(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}
