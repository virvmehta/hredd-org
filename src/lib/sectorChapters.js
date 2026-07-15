// HS chapters per sector, shared between the report engine (client-side
// question matching) and the trade page (server-side commodity filter).
// A single source of truth so the two never drift apart.
export const SECTORS = [
  { id: 'apparel', label: 'Textiles and apparel', chapters: ['50','51','52','53','54','55','56','57','58','59','60','61','62','63'] },
  { id: 'agrifood', label: 'Agriculture and food', chapters: ['01','02','09','12','15','16','18','20'] },
  { id: 'seafood', label: 'Seafood', chapters: ['03','16'] },
  { id: 'timber', label: 'Timber, paper and furniture', chapters: ['44','47','48','94'] },
  { id: 'electronics', label: 'Electronics and solar', chapters: ['85','28','38'] },
  { id: 'metals', label: 'Metals and minerals', chapters: ['26','76','71'] },
  { id: 'chemplast', label: 'Chemicals, plastics and rubber', chapters: ['39','40','28'] },
];

export const SECTOR_CHAPTERS = Object.fromEntries(SECTORS.map(s => [s.id, s.chapters]));

export const COMMODITY_CHAPTERS = {
  'Cattle or leather': '01', 'Cocoa': '18', 'Coffee': '09', 'Oil palm': '15',
  'Rubber': '40', 'Soya': '12', 'Wood, paper, or furniture': '44',
};
