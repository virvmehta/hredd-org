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
      name: 'deck',
      title: 'Deck',
      type: 'text',
      rows: 2,
      description: 'One sentence shown below the title. No em dashes.',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Analysis', 'Legal Analysis', 'Implementation', 'From the Field', 'Case Studies', 'Tracker', 'Opinion', 'Interview'],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
    },
    {
      name: 'authorRole',
      title: 'Author Role',
      type: 'string',
      description: 'One line, e.g. "Research Fellow, Institute for Responsible Business"',
    },
    {
      name: 'authorBio',
      title: 'Author Bio',
      type: 'text',
      rows: 4,
      description: 'One paragraph. Appears at the bottom of the article page.',
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
              title: 'Placeholder',
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
      of: [{ type: 'reference', to: [{ type: 'law' }] }],
    },
    {
      name: 'relatedArticles',
      title: 'Related Articles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
    },
  },
};
