export default {
  name: 'law',
  title: 'Law',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full Law Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'nativeName',
      title: 'Native Language Name',
      type: 'string',
      description: 'The official name in the enacting jurisdiction\'s language, if not English.',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: Rule => Rule.required(),
    },
    {
      name: 'jurisdiction',
      title: 'Jurisdiction',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'iso',
      title: 'ISO 3166-1 alpha-3 Country Code',
      type: 'string',
      description: 'e.g. DEU, FRA, GBR. Leave blank for EU-wide directives.',
    },
    {
      name: 'year',
      title: 'Year Enacted',
      type: 'number',
      validation: Rule => Rule.required().integer().min(1990).max(2040),
    },
    {
      name: 'inForce',
      title: 'Date Entered Into Force',
      type: 'date',
      description: 'Leave blank if not yet in force.',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'In force', value: 'in-force' },
          { title: 'Pending', value: 'pending' },
          { title: 'Proposed', value: 'proposed' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'scope',
      title: 'Scope (plain text)',
      type: 'text',
      rows: 3,
      description: 'One or two sentences describing which companies are covered.',
    },
    {
      name: 'provisions',
      title: 'Key Provisions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Provision Title' },
            { name: 'text', type: 'text', title: 'Provision Detail', rows: 3 },
          ],
        },
      ],
    },
    {
      name: 'timeline',
      title: 'Timeline',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'date', type: 'date', title: 'Date' },
            { name: 'event', type: 'string', title: 'Event' },
          ],
        },
      ],
    },
    {
      name: 'relatedLaws',
      title: 'Related Laws',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'law' }] }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'jurisdiction',
    },
  },
};
