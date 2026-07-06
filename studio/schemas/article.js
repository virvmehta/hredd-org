// REMINDER: after any change to this schema, redeploy the studio with
// `npx sanity deploy` from the studio folder so the fields appear at
// https://hredd-org.sanity.studio, then publish content to trigger the
// Cloudflare rebuild webhook.

export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required()
    },
    {
      name: 'deck',
      title: 'Deck (subtitle, shown on the article page below the headline)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(280).warning('Keep the deck under 280 characters.')
    },
    {
      name: 'excerpt',
      title: 'Excerpt (shown on article cards under the title)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(220).warning('Keep the excerpt under 220 characters.')
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          'Analysis',
          'Field Report',
          'Interview',
          'Commentary',
          'Case Study',
          'Dispatch',
          'From the Field'
        ]
      }
    },
    { name: 'authorName', title: 'Author name', type: 'string' },
    { name: 'authorBio', title: 'Author bio', type: 'text', rows: 2 },
    { name: 'authorLocation', title: 'Author location', type: 'string' },
    { name: 'publishedAt', title: 'Published at', type: 'datetime' },
    {
      name: 'readTime',
      title: 'Read time',
      type: 'string',
      description: 'e.g. 8 min read'
    },
    {
      name: 'featured',
      title: 'Featured (lead article on the homepage)',
      type: 'boolean',
      initialValue: false
    },
    { name: 'heroImage', title: 'Hero image', type: 'image', options: { hotspot: true } },
    { name: 'heroCaption', title: 'Hero image caption', type: 'string' },
    { name: 'heroCredit', title: 'Hero image photo credit', type: 'string' },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true }, fields: [
          { name: 'caption', type: 'string', title: 'Caption' },
          { name: 'alt', type: 'string', title: 'Alt text' }
        ] },
        {
          name: 'dataBlock',
          type: 'object',
          title: 'Data Block (3 stats)',
          fields: [
            { name: 'stat1number', type: 'string', title: 'Stat 1 Number' },
            { name: 'stat1label', type: 'string', title: 'Stat 1 Label' },
            { name: 'stat2number', type: 'string', title: 'Stat 2 Number' },
            { name: 'stat2label', type: 'string', title: 'Stat 2 Label' },
            { name: 'stat3number', type: 'string', title: 'Stat 3 Number' },
            { name: 'stat3label', type: 'string', title: 'Stat 3 Label' }
          ]
        }
      ]
    },
    {
      name: 'relatedLaws',
      title: 'Laws referenced',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'trackerLaw' }] }]
    },
    {
      name: 'relatedArticles',
      title: 'Related articles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }]
    },
    {
      name: 'disclosureOverride',
      title: 'Custom disclosure (overrides the site default disclaimer)',
      type: 'text',
      rows: 3
    }
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' }
  }
};
