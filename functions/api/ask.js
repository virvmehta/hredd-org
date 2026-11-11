// Ask hredd: stores a question the library could not answer, when the
// visitor chooses to send it. Kept in the same D1 database as the page view
// counter (binding `DB`). Nothing identifying is stored: only the question
// text, the day, and how close the search came.
import { ensureSchema } from './hit.js';

const BOTS = /bot|crawl|spider|headless|curl|wget|python|http-client/i;
// a 204 reply must have no body at all, or the runtime rejects it
const reply = (status, body = {}) => status === 204
  ? new Response(null, { status })
  : new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB) return reply(503, { error: 'The question store is not connected yet.' });
    const ua = request.headers.get('user-agent') || '';
    if (!ua || BOTS.test(ua)) return reply(204);

    const url = new URL(request.url);
    const origin = request.headers.get('origin');
    if (origin && new URL(origin).host !== url.host) return reply(403);

    const body = await request.json().catch(() => null);
    const q = body && typeof body.q === 'string' ? body.q.replace(/\s+/g, ' ').trim() : '';
    if (q.length < 5 || q.length > 300) return reply(400, { error: 'Questions must be between 5 and 300 characters.' });

    const now = new Date();
    const day = now.toISOString().slice(0, 10);
    await ensureSchema(env.DB);
    // a simple daily ceiling, so the store cannot be flooded
    const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM questions WHERE day = ?').bind(day).first();
    if (count && count.n >= 300) return reply(429, { error: 'Too many questions today.' });

    await env.DB.prepare('INSERT INTO questions (ts, day, question, level, top) VALUES (?, ?, ?, ?, ?)')
      .bind(now.toISOString(), day, q, String(body.level || '').slice(0, 10), String(body.top || '').slice(0, 120)).run();
    return reply(200, { ok: true });
  } catch (e) {
    return reply(500, { error: 'The question could not be saved.' });
  }
}
