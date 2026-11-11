// Tests the Ask hredd search with questions phrased the way real people ask.
// Each case: [question, expected answer slug, or null when no answer exists].
import { answers } from "../src/lib/answers.js";
import { buildIndex, search } from "../src/lib/askSearch.js";
const items = answers.map((x) => ({ slug: x.slug, law: x.law, q: x.q, a: x.a.join(' '), tags: x.tags }));
const index = buildIndex(items);

const cases = [
  ['is leather still in the eudr', 'is-leather-covered-by-the-eudr'],
  ['do tanneries need to comply with deforestation regulation', 'is-leather-covered-by-the-eudr'],
  ['eudr deadline', 'when-does-the-eudr-apply'],
  ['when does eudr come into force for small companies', ['do-small-businesses-get-more-time-under-the-eudr', 'when-does-the-eudr-apply']],
  ['will eudr be delayed again', 'will-the-eudr-be-delayed-again'],
  ['how many decimal places for gps coordinates', 'what-geolocation-data-does-the-eudr-require'],
  ['do I need polygons for my farm', 'what-geolocation-data-does-the-eudr-require'],
  ['is india low risk eudr', 'which-countries-are-low-risk-under-the-eudr'],
  ['what is the fine for breaking the eudr', 'what-are-the-penalties-under-the-eudr'],
  ['is rainforest alliance certification enough for eudr', 'is-certification-enough-for-the-eudr'],
  ['who submits the due diligence statement', 'who-files-the-eudr-due-diligence-statement'],
  ['instant coffee eudr', 'is-soluble-coffee-covered-by-the-eudr'],
  ['do smallholders have to register', 'do-smallholder-farmers-have-to-register-for-the-eudr'],
  ['eudr cutoff date', 'what-is-the-eudr-cut-off-date'],
  ['how long keep eudr documents', 'how-long-must-eudr-records-be-kept'],
  ['does csddd apply to my company in india', 'does-the-csddd-apply-to-suppliers-outside-the-eu'],
  ['csddd thresholds', 'which-companies-does-the-csddd-apply-to'],
  ['which companies are in scope of cs3d', 'which-companies-does-the-csddd-apply-to'],
  ['when does csddd start', 'when-does-the-csddd-apply'],
  ['can my buyer drop me under the csddd', 'must-a-buyer-end-the-relationship-under-the-csddd'],
  ['who pays for the audit csddd', 'who-pays-for-audits-under-the-csddd'],
  ['can workers sue the buyer under csddd', 'can-victims-sue-under-the-csddd'],
  ['csddd penalties', 'what-are-the-penalties-under-the-csddd'],
  ['climate transition plan csddd', 'does-the-csddd-still-require-a-climate-transition-plan'],
  ['can buyers send me endless questionnaires', 'can-a-buyer-demand-information-under-the-csddd'],
  ['difference between csrd and csddd', 'what-is-the-difference-between-the-csddd-and-the-csrd'],
  ['when does the forced labour regulation apply', 'when-does-the-forced-labour-regulation-apply'],
  ['forced labor ban eu date', 'when-does-the-forced-labour-regulation-apply'],
  ['are small companies exempt from the forced labour regulation', 'does-the-forced-labour-regulation-exempt-small-companies'],
  ['how long do I have to reply to an investigation flr', 'how-long-do-companies-have-to-respond-to-a-forced-labour-inquiry'],
  ['what happens if forced labour is found in my product', 'what-happens-if-forced-labour-is-found'],
  ['can the eu inspect my factory', 'can-the-eu-inspect-factories-outside-europe'],
  ['difference between uflpa and eu forced labour regulation', 'how-is-the-eu-regulation-different-from-the-uflpa'],
  ['who can report forced labour', 'who-can-report-forced-labour-to-the-eu'],
  ['can a forced labour ban be reversed', 'can-a-forced-labour-ban-be-lifted'],
  ['forced labour risk database', 'what-is-the-forced-labour-risk-database'],
  // questions the library does not answer: must NOT return a confident match
  ['what is the minimum wage in bangladesh', null],
  ['how do I get a visa for germany', null],
  ['uk modern slavery act statement requirements', null],
  ['best restaurants in delhi', null],
  ['does the german supply chain act apply to me', null],
  ['conflict minerals dodd frank', null],
];

let pass = 0; const fails = [];
for (const [q, want] of cases) {
  const r = search(index, q);
  const top = r.results[0];
  let ok;
  if (want === null) ok = r.level !== 'good';
  else { const wants = [].concat(want); ok = r.level !== 'none' && top && wants.includes(top.item.slug); }
  if (ok) pass++; else fails.push(`  ${q}\n     want ${want} | got ${r.level} ${top ? top.item.slug + ' ' + top.score.toFixed(2) : '-'}` + (r.results[1] ? ` ; 2nd ${r.results[1].item.slug} ${r.results[1].score.toFixed(2)}` : ''));
}
console.log(`${pass}/${cases.length} passed`);
if (fails.length) process.exitCode = 1;
if (fails.length) console.log('FAILED:\n' + fails.join('\n'));
if (process.argv[2] === '-v') for (const [q] of cases) { const r = search(index, q); console.log(r.level.padEnd(5), (r.results[0]?.score || 0).toFixed(2), q, '=>', r.results[0]?.item.slug || '-'); }
