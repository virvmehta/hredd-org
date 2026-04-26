export default {
  name: 'trackerLaw',
  title: 'Tracker Law',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full Law Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'shortName',
      title: 'Short Name / Abbreviation',
      type: 'string',
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
    },
    {
      name: 'region',
      title: 'Region',
      type: 'string',
      options: {
        list: [
          'European Union',
          'European Member States and UK',
          'North America',
          'Asia-Pacific',
          'Global South',
        ],
      },
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          'In force',
          'Pending',
          'Proposed',
          'Delayed',
          'Voluntary',
          'In committee',
          'Expanding',
          'Implementing',
          'Reform proposed',
          'Under review',
          'Updates pending',
          'In Congress',
        ],
      },
    },
    {
      name: 'statusType',
      title: 'Status Type (for tag colour)',
      type: 'string',
      options: {
        list: ['force', 'pending', 'proposed', 'delayed'],
      },
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
    },
    {
      name: 'tableUpdateText',
      title: 'One-line update (for tracker table)',
      type: 'string',
      description: 'Max 20 words. Shown in the tracker table row.',
    },
    {
      name: 'enactedDate',
      title: 'Enacted Date',
      type: 'string',
    },
    {
      name: 'firstComplianceDeadline',
      title: 'First Compliance Deadline',
      type: 'string',
    },
    {
      name: 'companiesInScope',
      title: 'Companies in Scope',
      type: 'string',
    },
    {
      name: 'maxPenalty',
      title: 'Maximum Penalty',
      type: 'string',
    },
    {
      name: 'civilLiability',
      title: 'Civil Liability',
      type: 'string',
    },
    {
      name: 'enforcementBody',
      title: 'Enforcement Body',
      type: 'string',
    },
    {
      name: 'sectorsAffected',
      title: 'Sectors Most Affected',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'supplierCountries',
      title: 'Supplier Countries Affected',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'summary',
      title: 'Plain-language Summary',
      type: 'array',
      of: [{ type: 'block' }],
      description: '3-4 paragraphs written for a Global South supply chain practitioner.',
    },
    {
      name: 'obligations',
      title: 'Key Obligations',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Obligation Title' },
            { name: 'detail', type: 'text', title: 'Obligation Detail' },
          ],
        },
      ],
    },
    {
      name: 'timeline',
      title: 'Implementation Timeline',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'date', type: 'string', title: 'Date' },
            { name: 'event', type: 'string', title: 'Event Name' },
            { name: 'detail', type: 'text', title: 'Detail' },
            {
              name: 'isFuture',
              type: 'boolean',
              title: 'Is this a future milestone?',
              initialValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'changelog',
      title: 'Change Log',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'date', type: 'date', title: 'Date' },
            { name: 'summary', type: 'string', title: 'One-line Summary' },
            { name: 'detail', type: 'text', title: 'Full Detail (2-4 paragraphs)' },
          ],
        },
      ],
    },
    {
      name: 'sources',
      title: 'Official Sources',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              type: 'string',
              title: 'Source Type',
              options: {
                list: ['Official text', 'Guidance', 'Analysis', 'Explainer', 'News'],
              },
            },
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'url', type: 'url', title: 'URL' },
            { name: 'organisation', type: 'string', title: 'Organisation' },
          ],
        },
      ],
    },
    {
      name: 'relatedArticles',
      title: 'Related Articles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
    },
    {
      name: 'countryCode',
      title: 'Country Code (ISO 3166-1 alpha-3)',
      type: 'string',
      description: 'e.g. DEU, FRA, GBR. Used to highlight this law on the world map.',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls order within region grouping on tracker page.',
    },
  ],
};
