// REMINDER: after any change to this schema, redeploy the studio with
// `npx sanity deploy` from the studio folder.

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'siteTitle', title: 'Site title', type: 'string' },
    {
      name: 'tagline',
      title: 'Masthead tagline',
      type: 'text',
      rows: 2,
      description: 'Shown under the homepage masthead title.'
    },
    {
      name: 'editorialQuote',
      title: 'Editorial quote (homepage dark strip)',
      type: 'text',
      rows: 3
    },
    {
      name: 'editorialQuoteAttribution',
      title: 'Editorial quote attribution',
      type: 'string'
    },
    {
      name: 'newsletterBlurb',
      title: 'Newsletter blurb',
      type: 'text',
      rows: 2
    },
    {
      name: 'articleDisclaimer',
      title: 'Article disclaimer (shown at the bottom of every article)',
      type: 'text',
      rows: 3,
      description: 'A single site-wide disclaimer. Individual articles can override it with their custom disclosure field.'
    },
    { name: 'contactEmail', title: 'Contact email', type: 'string' }
  ]
};
