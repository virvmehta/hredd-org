export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['From the Field', 'Legal Analysis', 'Implementation', 'Case Studies'],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'date',
      validation: Rule => Rule.required(),
    },
    {
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Shown in article cards. 1-2 sentences.',
    },
    {
      name: 'deck',
      title: 'Article Deck',
      type: 'text',
      rows: 2,
      description: 'Shown below title on article page. One sentence.',
    },
    {
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
    },
    {
      name: 'authorRole',
      title: 'Author Role (one line)',
      type: 'string',
    },
    {
      name: 'authorBio',
      title: 'Author Bio (full paragraph)',
      type: 'text',
      rows: 4,
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'Pull Quote', value: 'pullQuote' },
          ],
          marks: {
            decorators: [
              { title: 'Italic', value: 'em' },
              { title: 'Bold', value: 'strong' },
            ],
          },
        },
        {
          type: 'object',
          name: 'callout',
          title: 'Callout Block',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'body', type: 'text', title: 'Body' },
          ],
        },
        {
          type: 'object',
          name: 'sectionBreak',
          title: 'Section Break',
          fields: [
            {
              name: 'placeholder',
              type: 'string',
              title: 'placeholder',
              initialValue: 'section-break',
              hidden: true,
            },
          ],
        },
        {
          type: 'object',
          name: 'dataBlock',
          title: 'Data Block (3 stats)',
          fields: [
            { name: 'stat1number', type: 'string', title: 'Stat 1 Number' },
            { name: 'stat1label', type: 'string', title: 'Stat 1 Label' },
            { name: 'stat2number', type: 'string', title: 'Stat 2 Number' },
            { name: 'stat2label', type: 'string', title: 'Stat 2 Label' },
            { name: 'stat3number', type: 'string', title: 'Stat 3 Number' },
            { name: 'stat3label', type: 'string', title: 'Stat 3 Label' },
          ],
        },
      ],
    },
    {
      name: 'referencedLaws',
      title: 'Laws Referenced',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'trackerLaw' }] }],
    },
    {
      name: 'relatedArticles',
      title: 'Related Articles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
    },
  ],
};
