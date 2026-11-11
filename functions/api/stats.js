// Private read-out of the page view counter. Requires the password stored
// in the Cloudflare variable STATS_KEY, sent in the `x-stats-key` header.
import { ensureSchema } from './hit.js';

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
});

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: 'The database is not connected yet. Bind a D1 database as DB in Cloudflare.' }, 503);
  if (!env.STATS_KEY) return json({ error: 'No password is set yet. Add the STATS_KEY variable in Cloudflare.' }, 503);
  if (request.headers.get('x-stats-key') !== env.STATS_KEY) return json({ error: 'Wrong password.' }, 401);

  const days = Math.min(365, Math.max(1, Number(new URL(request.url).searchParams.get('days')) || 30));
  const since = new Date(Date.now() - (days - 1) * 86400000).toISOString().slice(0, 10);
  const db = env.DB;
  await ensureSchema(db);

  const top = (col, limit) => db.prepare(
    `SELECT ${col} AS label, COUNT(*) AS views, COUNT(DISTINCT day || visitor) AS visitors
     FROM hits WHERE day >= ? GROUP BY ${col} ORDER BY views DESC LIMIT ${limit}`).bind(since);

  const [totals, daily, pages, sources, countries, devices, first] = await db.batch([
    db.prepare('SELECT COUNT(*) AS views, COUNT(DISTINCT day || visitor) AS visitors FROM hits WHERE day >= ?').bind(since),
    db.prepare('SELECT day, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors FROM hits WHERE day >= ? GROUP BY day ORDER BY day').bind(since),
    top('path', 25), top('source', 15), top('country', 15), top('device', 5),
    db.prepare('SELECT MIN(day) AS day FROM hits'),
  ]);
  // real visitors per calendar month, the last twelve months, newest first
  const months = await db.prepare(
    `SELECT substr(day, 1, 7) AS month, COUNT(DISTINCT mvisitor) AS visitors, COUNT(*) AS views
     FROM hits WHERE mvisitor != '' GROUP BY month ORDER BY month DESC LIMIT 12`).all();
  // questions sent through Ask hredd, newest first
  const questions = await db.prepare('SELECT day, question, level, top FROM questions ORDER BY id DESC LIMIT 100').all();

  return json({
    days, since,
    counting_since: first.results[0]?.day || null,
    totals: totals.results[0],
    months: months.results,
    daily: daily.results,
    pages: pages.results,
    sources: sources.results,
    countries: countries.results,
    devices: devices.results,
    questions: questions.results,
  });
}
