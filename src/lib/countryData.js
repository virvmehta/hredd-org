// countryData.js : the country exposure engine.
// Each country is one small object. Adding an object here creates a full page
// at /countries/{slug}/ on the next build, populated from live tracker data.
// Law relevance is derived from the tracker's own supplierCountries field,
// enriched by the channel map below and per-country commodity attributes.

// How each law actually reaches a supplier. Channels:
//   border   : import control applied at the destination market border
//   cascade  : contractual cascade from in-scope buyers
//   disclosure : buyer-side reporting that generates information requests
//   diligence : buyer-side due diligence duty generating audits and questionnaires
export const LAW_CHANNELS = {
  'eu-csddd':                        { channel: 'diligence',  market: 'European Union' },
  'eu-csrd':                         { channel: 'disclosure', market: 'European Union' },
  'eu-deforestation-regulation':     { channel: 'border',     market: 'European Union', commodityBased: true },
  'eu-forced-labour-regulation':     { channel: 'border',     market: 'European Union' },
  'eu-batteries-regulation':         { channel: 'diligence',  market: 'European Union', commodityBased: true },
  'germany-lksg':                    { channel: 'diligence',  market: 'Germany' },
  'france-duty-of-vigilance':        { channel: 'diligence',  market: 'France' },
  'norway-transparency-act':         { channel: 'diligence',  market: 'Norway' },
  'netherlands-child-labour-act':    { channel: 'diligence',  market: 'Netherlands' },
  'switzerland-due-diligence-ordinance': { channel: 'diligence', market: 'Switzerland', commodityBased: true },
  'uk-modern-slavery-act':           { channel: 'disclosure', market: 'United Kingdom' },
  'us-uflpa':                        { channel: 'border',     market: 'United States' },
  'us-dodd-frank-1502':              { channel: 'disclosure', market: 'United States', commodityBased: true },
  'new-york-fashion-act':            { channel: 'diligence',  market: 'United States', proposed: true },
  'canada-s211':                     { channel: 'disclosure', market: 'Canada' },
  'australia-modern-slavery-act':    { channel: 'disclosure', market: 'Australia' },
  'japan-meti-guidelines':           { channel: 'diligence',  market: 'Japan' },
  'south-korea-hredd-bill':          { channel: 'diligence',  market: 'South Korea', proposed: true },
};

export const CHANNEL_LABELS = {
  border:     'Checked at the border',
  diligence:  'Cascaded through buyer due diligence',
  disclosure: 'Surfaced through buyer disclosure',
};

export const CHANNEL_EXPLAINERS = {
  border: 'These regimes operate as import controls. Goods can be stopped, detained, or refused at the destination border, so the exposure attaches to the consignment itself rather than to any contract.',
  diligence: 'These regimes place due diligence duties on buyers, who discharge them contractually. The obligations reach suppliers as questionnaires, audits, code of conduct clauses, and corrective action plans.',
  disclosure: 'These regimes require buyers to publish statements or reports on their chains. They reach suppliers as periodic information requests feeding the buyer\u2019s own filing.',
};

// The country registry. Everything a page needs beyond the tracker itself.
export const countries = [
  {
    slug: 'bangladesh',
    name: 'Bangladesh',
    region: 'South Asia',
    extraLaws: ['us-uflpa'],
    profile: 'Bangladesh is the world\u2019s second largest garment exporter, with ready-made garments accounting for over four fifths of export earnings and the European Union taking roughly half of them. That concentration means Bangladeshi suppliers sit inside the chains of nearly every European brand and retailer now covered by due diligence and disclosure law, while the sector\u2019s dependence on imported cotton creates border-control exposure in the American market as well.',
    sectors: ['Ready-made garments', 'Textiles', 'Leather and footwear', 'Frozen seafood', 'Jute'],
    eudrCommodities: [],
    keyMarkets: ['European Union', 'United States', 'United Kingdom', 'Canada', 'Japan'],
    exposureNotes: {
      'us-uflpa': 'Bangladeshi garments carry UFLPA exposure through cotton inputs rather than through Bangladeshi production itself. Consignments have been detained where cotton could not be traced away from Xinjiang, so fibre-level traceability documentation is the preparation that matters.',
      'germany-lksg': 'Germany is one of Bangladesh\u2019s largest single garment markets, and German buyers were among the first to cascade LkSG questionnaires and audit requirements to Dhaka and Chattogram suppliers at scale.',
      'eu-csddd': 'Most major European fashion groups sourcing from Bangladesh sit above the amended thresholds, so cascade through contract clauses and information requests is a question of when rather than whether.',
    },
  },
  {
    slug: 'vietnam',
    name: 'Vietnam',
    region: 'Southeast Asia',
    profile: 'Vietnam combines large-scale manufacturing for Western brands with significant production of three EUDR commodities, which gives its suppliers a double exposure that few countries share. Garment, footwear, and electronics factories face buyer cascade from every European and North American due diligence regime, while coffee, rubber, and timber producers face the EU border directly, and the country\u2019s proximity to Chinese inputs keeps UFLPA transshipment scrutiny persistently high.',
    sectors: ['Electronics', 'Garments and footwear', 'Furniture and wood products', 'Coffee', 'Rubber', 'Seafood'],
    eudrCommodities: ['Coffee', 'Rubber', 'Wood'],
    keyMarkets: ['United States', 'European Union', 'Japan', 'South Korea'],
    exposureNotes: {
      'eu-deforestation-regulation': 'Vietnam is the world\u2019s largest robusta coffee exporter and a major wood furniture supplier to Europe, so plot-level geolocation demands are already arriving through coffee traders and furniture buyers ahead of the SME application date.',
      'us-uflpa': 'US Customs has applied particular scrutiny to goods routed through Vietnam for possible Xinjiang inputs, especially in apparel, solar, and electronics, which makes documented chain of custody the decisive preparation for Vietnamese exporters.',
      'japan-meti-guidelines': 'Japan and South Korea are top-tier markets for Vietnamese manufacturing, and both are moving from voluntary guidance toward harder expectations, so requests from East Asian buyers increasingly mirror European ones.',
    },
  },
  {
    slug: 'brazil',
    name: 'Brazil',
    region: 'Latin America',
    extraLaws: ['eu-forced-labour-regulation', 'eu-csrd', 'switzerland-due-diligence-ordinance'],
    profile: 'Brazil is the single most EUDR-exposed country on earth, producing four of the regulation\u2019s seven commodities at world-leading scale, with the European Union among the principal destinations for its soya, beef, coffee, and timber. Border-control exposure therefore dominates the Brazilian picture, while the country\u2019s large manufacturing base and its own advancing traceability systems shape how buyer cascade lands.',
    sectors: ['Soya', 'Beef and leather', 'Coffee', 'Timber and pulp', 'Sugar and ethanol', 'Mining'],
    eudrCommodities: ['Soya', 'Cattle', 'Coffee', 'Wood'],
    keyMarkets: ['European Union', 'China', 'United States'],
    exposureNotes: {
      'eu-deforestation-regulation': 'Brazil produces four covered commodities at scale, and the geolocation requirement lands on some of the most contested land-use geographies in the world, so documentation quality decides market access here more than anywhere else.',
      'eu-csddd': 'European food, feed, and fashion groups sourcing Brazilian commodities sit squarely in scope, and their risk mapping will concentrate on land rights, deforestation, and rural labour conditions in their Brazilian chains.',
      'france-duty-of-vigilance': 'French duty of vigilance litigation has already reached Brazilian supply chains, with cases concerning deforestation and land rights in cattle and soya, making France\u2019s regime a live rather than theoretical exposure.',
      'eu-forced-labour-regulation': 'The FLR covers every product from every origin without thresholds, and Brazilian sectors with documented labour risk findings, notably cattle, coffee, and charcoal, are candidates for the risk database that will steer the first investigations.',
    },
  },
];

// Relevance: a law appears on a country page when the tracker itself names the
// country as a key supplier geography, or when the law is commodity-based and
// the country produces a covered commodity. Zero manual curation per law.
export function lawsForCountry(country, allLaws){
  const rows = [];
  for(const law of allLaws){
    const meta = LAW_CHANNELS[law.slug] || { channel: 'diligence', market: law.jurisdiction };
    const named = (law.supplierCountries || []).some(c => c.toLowerCase() === country.name.toLowerCase())
      || (country.extraLaws || []).includes(law.slug);
    const commodityHit = meta.commodityBased && country.eudrCommodities.length > 0 &&
      law.slug === 'eu-deforestation-regulation';
    if(named || commodityHit){
      rows.push({ law, meta, note: country.exposureNotes[law.slug] || null });
    }
  }
  const order = { border: 0, diligence: 1, disclosure: 2 };
  rows.sort((a, b) => (order[a.meta.channel] - order[b.meta.channel]) || (a.law.order - b.law.order));
  return rows;
}
