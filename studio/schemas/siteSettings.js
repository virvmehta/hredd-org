export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'vol',
      title: 'Volume Label',
      type: 'string',
      description: 'e.g. "VOL I"',
      initialValue: 'VOL I',
    },
    {
      name: 'issue',
      title: 'Issue Number',
      type: 'number',
      description: 'Displayed as Roman numerals in the TopStrip.',
    },
    {
      name: 'issueDate',
      title: 'Issue Date',
      type: 'date',
      description: 'The date of the current issue. Used to compute the month label in TopStrip.',
    },
    {
      name: 'nextIssueDate',
      title: 'Next Issue Date',
      type: 'date',
    },
  ],
};
