// First-party page view counter. Runs on Cloudflare Pages Functions and
// stores one row per page view in a D1 database bound as `DB`.
//
// Privacy: no cookies and no stored IP addresses. A visitor is recognised
// by a one-way hash of the period + IP + browser: `visitor` within one day,
// `mvisitor` within one calendar month (the headline monthly figure).

const BOTS = /bot|crawl|spider|slurp|preview|scan|monitor|headless|lighthouse|curl|wget|python|http-client|fetch|facebookexternalhit|whatsapp|telegram|gptbot|claude|perplexity|bytespider|ahrefs|semrush|uptime/i;

const SCHEMA = `CREATE TABLE IF NOT EXISTS hits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  day TEXT NOT NULL,
  path TEXT NOT NULL,
  source TEXT NOT NULL,
  country TEXT NOT NULL,
  device TEXT NOT NULL,
  visitor TEXT NOT NULL,
  mvisitor TEXT NOT NULL DEFAULT ''
)`;

let ready = null;
export function ensureSchema(db) {
  if (!ready) {
    ready = db.batch([
      db.prepare(SCHEMA),
      db.prepare('CREATE INDEX IF NOT EXISTS hits_day ON hits (day)'),
      // Ask hredd: questions visitors chose to send (functions/api/ask.js)
      db.prepare('CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT NOT NULL, day TEXT NOT NULL, question TEXT NOT NULL, level TEXT NOT NULL, top TEXT NOT NULL)'),
    ])
      // a table made before the monthly column existed gains it here; the
      // error when it is already there is expected and ignored
      .then(() => db.prepare("ALTER TABLE hits ADD COLUMN mvisitor TEXT NOT NULL DEFAULT ''").run().catch(() => {}))
      .catch((e) => { ready = null; throw e; });
  }
  return ready;
}

// Where the visit came from, in plain words.
function sourceOf(ref, utm, host) {
  if (utm) return utm.toLowerCase().slice(0, 40);
  let h = '';
  try { h = new URL(ref).hostname.replace(/^www\./, ''); } catch (e) {}
  if (!h || h === host) return 'direct';
  if (/google\./.test(h)) return 'google';
  if (/bing\.com$/.test(h)) return 'bing';
  if (/duckduckgo|ecosia|yahoo|yandex|baidu|brave/.test(h)) return h.split('.').slice(-2, -1)[0];
  if (/linkedin|lnkd\.in/.test(h)) return 'linkedin';
  if (/chatgpt|openai/.test(h)) return 'chatgpt';
  if (/perplexity/.test(h)) return 'perplexity';
  if (/copilot|claude\.ai|gemini/.test(h)) return h.split('.').slice(-2, -1)[0];
  if (/facebook|instagram|t\.co$|twitter|x\.com$/.test(h)) return h.replace(/^(m|l)\./, '').split('.')[0];
  if (/buttondown/.test(h)) return 'newsletter';
  return h.slice(0, 40);
}

async function hash(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost({ request, env }) {
  const done = new Response(null, { status: 204 });
  try {
    if (!env.DB) return done;
    const ua = request.headers.get('user-agent') || '';
    if (!ua || BOTS.test(ua)) return done;

    const url = new URL(request.url);
    const origin = request.headers.get('origin');
    if (origin && new URL(origin).host !== url.host) return done;

    const body = await request.json().catch(() => null);
    if (!body || typeof body.p !== 'string' || !body.p.startsWith('/') || body.p.length > 200) return done;
    if (body.p.startsWith('/stats') || body.p.startsWith('/api/')) return done;

    const now = new Date();
    const day = now.toISOString().slice(0, 10);
    const ip = request.headers.get('cf-connecting-ip') || '';
    const salt = env.STATS_KEY || 'hredd';
    const visitor = await hash(`${day}|${ip}|${ua}|${salt}`);
    const mvisitor = await hash(`${day.slice(0, 7)}|${ip}|${ua}|${salt}`);
    const width = Number(body.w) || 0;

    await ensureSchema(env.DB);
    await env.DB.prepare(
      'INSERT INTO hits (ts, day, path, source, country, device, visitor, mvisitor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      now.toISOString(), day, body.p.replace(/\/+$/, '/') || '/',
      sourceOf(String(body.r || ''), String(body.s || ''), url.hostname),
      (request.cf && request.cf.country) || 'unknown',
      width && width < 700 ? 'mobile' : width && width < 1100 ? 'tablet' : 'desktop',
      visitor, mvisitor
    ).run();
  } catch (e) {
    // Counting must never break the page, so errors are swallowed.
  }
  return done;
}
