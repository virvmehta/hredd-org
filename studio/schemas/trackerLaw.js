// REMINDER: after any change to this schema, redeploy the studio with
// `npx sanity deploy` from the studio folder.

export default {
  name: 'trackerLaw',
  title: 'Tracker Law',
  type: 'document',
  fields: [
    { name: 'name', title: 'Full law name', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'shortName', title: 'Short name / abbreviation', type: 'string' },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required()
    },
    { name: 'jurisdiction', title: 'Jurisdiction', type: 'string' },
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
          'Global South'
        ]
      }
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          'In force', 'Pending', 'Proposed', 'Delayed', 'Voluntary',
          'In committee', 'Expanding', 'Implementing', 'Reform proposed',
          'Under review', 'Updates pending', 'In Congress'
        ]
      }
    },
    {
      name: 'statusType',
      title: 'Status type (controls the tag colour)',
      type: 'string',
      options: { list: ['force', 'pending', 'proposed', 'delayed'] }
    },
    { name: 'lastUpdated', title: 'Entry last updated', type: 'date' },
    {
      name: 'tableUpdateText',
      title: 'One-line update (for the tracker table)',
      type: 'string',
      description: 'Maximum 20 words. Shown in the tracker table row and the monthly movements list.'
    },
    { name: 'enactedDate', title: 'Enacted date', type: 'string' },
    { name: 'firstComplianceDeadline', title: 'First compliance deadline', type: 'string' },
    { name: 'companiesInScope', title: 'Companies in scope', type: 'string' },
    { name: 'maxPenalty', title: 'Maximum penalty', type: 'string' },
    { name: 'civilLiability', title: 'Civil liability', type: 'string' },
    { name: 'enforcementBody', title: 'Enforcement body', type: 'string' },
    {
      name: 'sectorsAffected',
      title: 'Sectors most affected',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'supplierCountries',
      title: 'Supplier countries affected',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'countryCodes',
      title: 'Country codes (ISO 3166-1 alpha-3)',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Countries where this law applies, used to shade the world map. EU-wide laws should list all member state codes. Example: DEU for Germany.'
    },
    {
      name: 'oneLineSummary',
      title: 'One-line summary',
      type: 'text',
      rows: 2,
      description: 'Shown on law cards, the map panel and article references.'
    },
    {
      name: 'summary',
      title: 'Plain-language summary',
      type: 'array',
      of: [{ type: 'block' }],
      description: '3 to 4 paragraphs written for a Global South supply chain practitioner.'
    },
    {
      name: 'obligations',
      title: 'Key obligations',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Obligation' },
            { name: 'detail', type: 'text', rows: 2, title: 'Detail' }
          ]
        }
      ]
    },
    {
      name: 'timeline',
      title: 'Timeline',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'date', type: 'string', title: 'Date' },
            { name: 'event', type: 'text', rows: 2, title: 'Event' }
          ]
        }
      ]
    },
    {
      name: 'changelog',
      title: 'Tracker changelog',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'date', type: 'string', title: 'Date' },
            { name: 'text', type: 'text', rows: 2, title: 'What changed' }
          ]
        }
      ]
    },
    {
      name: 'sources',
      title: 'Sources',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Source title' },
            { name: 'url', type: 'url', title: 'URL' }
          ]
        }
      ]
    },
    {
      name: 'order',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first in the tracker table.'
    }
  ],
  preview: {
    select: { title: 'name', subtitle: 'jurisdiction' }
  }
};
