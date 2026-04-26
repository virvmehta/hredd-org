export const getAllArticlesQuery = `*[_type == "article"] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  category,
  publishedAt,
  readTime,
  excerpt,
  deck,
  authorName
}`;

export const getArticleBySlugQuery = `*[_type == "article" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  category,
  publishedAt,
  readTime,
  excerpt,
  deck,
  authorName,
  authorRole,
  authorBio,
  body,
  "referencedLaws": referencedLaws[]->{name, shortName, "slug": slug.current},
  "relatedArticles": relatedArticles[]->{title, "slug": slug.current, category, authorName, readTime, excerpt}
}`;

export const getAllLawSlugsQuery = `*[_type == "trackerLaw"] | order(order asc) {
  name,
  shortName,
  "slug": slug.current,
  jurisdiction,
  region,
  status,
  statusType,
  lastUpdated,
  tableUpdateText,
  countryCode,
  order
}`;

export const getLawBySlugQuery = `*[_type == "trackerLaw" && slug.current == $slug][0] {
  name,
  shortName,
  "slug": slug.current,
  jurisdiction,
  region,
  status,
  statusType,
  lastUpdated,
  tableUpdateText,
  enactedDate,
  firstComplianceDeadline,
  companiesInScope,
  maxPenalty,
  civilLiability,
  enforcementBody,
  sectorsAffected,
  supplierCountries,
  countryCode,
  summary,
  obligations,
  timeline,
  changelog,
  sources,
  "relatedArticles": relatedArticles[]->{title, "slug": slug.current, category, authorName, readTime, excerpt},
  order
}`;

export const getSiteSettingsQuery = `*[_type == "siteSettings"][0] {
  currentVolume,
  currentIssue,
  currentMonth,
  trackerLastUpdated,
  trackerNextUpdate,
  editorialQuote,
  articleDisclaimer,
  movementsThisMonth
}`;

export const getAllLawRegionsQuery = `*[_type == "trackerLaw"] | order(order asc) {
  name,
  shortName,
  "slug": slug.current,
  jurisdiction,
  region,
  status,
  statusType,
  lastUpdated,
  tableUpdateText,
  countryCode,
  order
}`;
