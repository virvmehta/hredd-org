// The site's author, in one place, so every page names the same verifiable
// person. Search engines and AI answer tools join the pages to the profile
// through the shared "@id" and confirm who it is through "sameAs".
// Deliberately no employer: hredd.org is independent of any organisation.

export const AUTHOR = {
  name: 'Vir Mehta',
  page: '/about/#author',
  linkedin: 'https://www.linkedin.com/in/vir-mehta-b6322018b/',
  jobTitle: 'Decent work and supply chain sustainability practitioner',
  bio: 'Vir Mehta is a decent work and supply chain sustainability practitioner based in Noida, India, who founded hredd.org and writes or reviews every law entry, article and answer published on it.',
};

const ID = 'https://hredd.org/about/#author';

// Full description, used once on the About page.
export const authorSchema = {
  '@type': 'Person',
  '@id': ID,
  name: AUTHOR.name,
  url: 'https://hredd.org' + AUTHOR.page,
  jobTitle: AUTHOR.jobTitle,
  description: AUTHOR.bio,
  address: { '@type': 'PostalAddress', addressLocality: 'Noida', addressCountry: 'IN' },
  sameAs: [AUTHOR.linkedin],
  knowsAbout: ['Human rights due diligence', 'Environmental due diligence', 'Decent work', 'Supply chain sustainability', 'CSDDD', 'EUDR', 'EU Forced Labour Regulation'],
};

// Short reference for every other page; points back to the full one.
export const authorRef = { '@type': 'Person', '@id': ID, name: AUTHOR.name, url: 'https://hredd.org' + AUTHOR.page, sameAs: [AUTHOR.linkedin] };

export const isSiteAuthor = (name) => (name || '').trim().toLowerCase() === AUTHOR.name.toLowerCase();
