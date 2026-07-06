/**
 * All GROQ queries used by the site, kept in one place so schema
 * changes only ever require edits in a single file.
 */
export const queries = {
  allLaws: `*[_type == "trackerLaw"] {
    "slug": slug.current,
    name, shortName, jurisdiction, region, status, statusType,
    lastUpdated, tableUpdateText, enactedDate, firstComplianceDeadline,
    companiesInScope, maxPenalty, civilLiability, enforcementBody,
    sectorsAffected, supplierCountries, countryCode, countryCodes,
    oneLineSummary, summary, obligations, timeline, changelog, sources, order
  }`,

  allArticles: `*[_type == "article"] {
    "slug": slug.current,
    title, deck, excerpt, category, authorName, authorBio, authorLocation,
    publishedAt, readTime, featured, heroCaption, heroCredit, body,
    disclosureOverride,
    "relatedLaws": relatedLaws[]->{ "slug": slug.current, name, shortName, status, statusType, jurisdiction, oneLineSummary },
    "relatedArticles": relatedArticles[]->{ "slug": slug.current, title, category, publishedAt, readTime }
  }`,

  siteSettings: `*[_type == "siteSettings"][0] {
    siteTitle, tagline, editorialQuote, editorialQuoteAttribution,
    newsletterBlurb, articleDisclaimer, contactEmail
  }`
};
