// Ask hredd search: matches a visitor's question against the approved
// answers. It runs entirely in the browser, with no server and no AI call.
//
// Method: both sides are reduced to plain word stems. Each answer's words
// carry a weight by where they appear (question 3, tags and law name 2,
// answer text 1) and by how rare they are across the library. A query's
// score is the share of its own weight that an answer covers, so a short
// precise question and a long rambling one are judged on the same scale.

const STOP = new Set(('a an and are as at be been but by can could do does did for from had has have how i if in into is it its ' +
  'me my of on or our shall should so than that the their them then there these they this to under was we were what when where ' +
  'which who whom why will with would you your about any also need want know tell please get got am us eu').split(' '));

// spelling variants and near-synonyms, folded to one form
const FOLD = {
  labor: 'labour', soy: 'soya', soybean: 'soya', soybeans: 'soya', tire: 'tyre', tires: 'tyre', tyres: 'tyre',
  cs3d: 'csddd', csdd: 'csddd', cddd: 'csddd', euflr: 'flr', uyghur: 'uflpa',
  fine: 'penalty', fines: 'penalty', penalties: 'penalty', sanction: 'penalty', sanctions: 'penalty', punishment: 'penalty',
  deadline: 'start', deadlines: 'start', dates: 'date', begin: 'start', begins: 'start', starts: 'start', effect: 'start',
  postponed: 'delay', postponement: 'delay', delayed: 'delay', delays: 'delay', extension: 'delay',
  firm: 'company', firms: 'company', companies: 'company', business: 'company', businesses: 'company', enterprise: 'company', enterprises: 'company',
  smes: 'sme', small: 'sme', smaller: 'sme', micro: 'sme', tiny: 'sme',
  exempt: 'exemption', exempted: 'exemption', excluded: 'exemption',
  cover: 'covered', covers: 'covered', applies: 'apply', applicable: 'apply', scope: 'covered', included: 'covered',
  farmers: 'farmer', smallholders: 'smallholder', suppliers: 'supplier', buyers: 'buyer', customers: 'buyer', customer: 'buyer',
  gps: 'geolocation', coordinates: 'geolocation', coordinate: 'geolocation', mapping: 'geolocation', polygons: 'polygon',
  audits: 'audit', auditing: 'audit', verification: 'audit', certified: 'certification', certificate: 'certification', certificates: 'certification',
  sue: 'liability', lawsuit: 'liability', court: 'liability', damages: 'liability', compensation: 'liability',
  complain: 'complaint', complaints: 'complaint', grievance: 'complaint', report: 'report', reporting: 'report',
  banned: 'ban', prohibited: 'ban', prohibition: 'ban', seized: 'ban', destroyed: 'disposal', destroy: 'disposal', dispose: 'disposal',
  investigate: 'investigation', investigated: 'investigation', investigations: 'investigation', inquiry: 'investigation',
  hides: 'leather', skins: 'leather', tannery: 'leather', tanneries: 'leather', tanner: 'leather', cows: 'cattle', cow: 'cattle', beef: 'cattle',
  timber: 'wood', furniture: 'wood', paper: 'wood', palm: 'palm', cacao: 'cocoa', chocolate: 'cocoa',
  questionnaires: 'questionnaire', records: 'record', documents: 'record', paperwork: 'record',
  terminate: 'termination', terminated: 'termination', drop: 'termination', dropped: 'termination', cut: 'termination',
};

// whole phrases that name a law, replaced before splitting into words
const PHRASES = [
  [/deforestation(-|\s)free products regulation|deforestation regulation|deforestation law/g, ' eudr '],
  [/forced labou?r regulation|forced labou?r ban|forced labou?r law/g, ' flr '],
  [/corporate sustainability due diligence directive|due diligence directive|supply chain directive/g, ' csddd '],
  [/due diligence statement/g, ' dds statement '],
  [/\bdds\b/g, ' dds statement '],
];

export function tokens(text) {
  let s = String(text || '').toLowerCase().replace(/[‘’']/g, '');
  for (const [re, to] of PHRASES) s = s.replace(re, to);
  const out = [];
  for (let w of s.split(/[^a-z0-9]+/)) {
    if (!w || STOP.has(w)) continue;
    w = FOLD[w] || w;
    if (!FOLD[w] && w.length > 4 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
    w = FOLD[w] || w;
    if (!STOP.has(w)) out.push(w);
  }
  return out;
}

const LAW_WORDS = {
  'eu-deforestation-regulation': 'eudr deforestation',
  'eu-csddd': 'csddd directive',
  'eu-forced-labour-regulation': 'flr forced labour',
};

// Build once from the index: per-answer word weights and word rarity.
export function buildIndex(items) {
  const docs = items.map((it) => {
    const w = new Map();
    const add = (text, weight) => { for (const t of tokens(text)) if ((w.get(t) || 0) < weight) w.set(t, weight); };
    add(it.a, 1); add(it.tags, 2); add(LAW_WORDS[it.law] || '', 2); add(it.q, 3);
    return { it, w };
  });
  const df = new Map();
  for (const d of docs) for (const t of d.w.keys()) df.set(t, (df.get(t) || 0) + 1);
  const N = docs.length || 1;
  const idf = (t) => Math.log(1 + N / (1 + (df.get(t) || 0)));
  return { docs, idf, maxIdf: Math.log(1 + N) };
}

// Returns { level: 'good' | 'close' | 'none', results: [{ item, score }] }
export function search(index, query, limit = 5) {
  const qt = [...new Set(tokens(query))];
  if (!qt.length) return { level: 'none', results: [] };
  const lawHit = Object.entries(LAW_WORDS).filter(([, words]) => qt.some((t) => words.split(' ').includes(t))).map(([law]) => law);
  let total = 0;
  for (const t of qt) total += 3 * index.idf(t);
  const scored = [];
  for (const d of index.docs) {
    let s = 0;
    for (const t of qt) {
      let weight = d.w.get(t) || 0;
      if (!weight && t.length >= 5) {
        // forgiving match for word endings: "investigating" finds "investigation"
        for (const [dt, dw] of d.w) if (dt.length >= 5 && (dt.startsWith(t.slice(0, 5)) && t.startsWith(dt.slice(0, 5)))) { weight = Math.max(weight, dw * 0.7); }
      }
      s += weight * index.idf(t);
    }
    let score = s / total;
    if (lawHit.length) score *= lawHit.includes(d.it.law) ? 1.15 : 0.6;
    if (score > 0.12) scored.push({ item: d.it, score });
  }
  scored.sort((a, b) => b.score - a.score);
  const top = scored[0]?.score || 0;
  const level = top >= 0.5 ? 'good' : top >= 0.27 ? 'close' : 'none';
  return { level, results: scored.slice(0, limit) };
}
