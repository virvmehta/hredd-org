export const LAWS_QUERY = `*[_type == "law"] | order(year desc) {
  _id,
  name,
  nativeName,
  "slug": slug.current,
  jurisdiction,
  iso,
  year,
  inForce,
  status,
  scope
}`;

export const LAW_BY_SLUG_QUERY = `*[_type == "law" && slug.current == $slug][0] {
  _id,
  name,
  nativeName,
  "slug": slug.current,
  jurisdiction,
  iso,
  year,
  inForce,
  status,
  scope,
  provisions,
  timeline,
  "relatedLaws": relatedLaws[]-> {
    name,
    "slug": slug.current,
    jurisdiction,
    year,
    status
  }
}`;

export const ARTICLES_QUERY = `*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  deck,
  category,
  "author": authorName,
  publishedAt,
  readTime
}`;

export const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  deck,
  category,
  "author": authorName,
  authorRole,
  authorBio,
  publishedAt,
  readTime,
  body
}`;

export const SITE_SETTINGS_QUERY = `*[_id == "siteSettings"][0]`;
