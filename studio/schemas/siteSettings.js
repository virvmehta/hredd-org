export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'currentVolume',
      title: 'Current Volume',
      type: 'number',
    },
    {
      name: 'currentIssue',
      title: 'Current Issue',
      type: 'number',
    },
    {
      name: 'currentMonth',
      title: 'Current Month (e.g. June 2026)',
      type: 'string',
    },
    {
      name: 'trackerLastUpdated',
      title: 'Tracker Last Updated',
      type: 'string',
    },
    {
      name: 'trackerNextUpdate',
      title: 'Tracker Next Update',
      type: 'string',
    },
    {
      name: 'editorialQuote',
      title: 'Editorial Quote (homepage strip)',
      type: 'text',
    },
    {
      name: 'movementsThisMonth',
      title: 'This Month Movements (3 items)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'lawName', type: 'string', title: 'Law Name' },
            { name: 'jurisdiction', type: 'string', title: 'Jurisdiction' },
            { name: 'summary', type: 'text', title: 'Summary' },
          ],
        },
      ],
    },
  ],
};
