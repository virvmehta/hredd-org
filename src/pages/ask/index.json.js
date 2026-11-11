// Search index for Ask hredd: approved answers only, fetched once by the page.
import { liveAnswers } from '../../lib/answers.js';

export async function GET() {
  const items = liveAnswers().map((x) => ({ slug: x.slug, law: x.law, q: x.q, a: x.a, basis: x.basis, tags: x.tags, checked: x.checked }));
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
}
