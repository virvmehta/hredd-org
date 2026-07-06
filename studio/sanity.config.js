import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'default',
  title: 'hredd.org',
  projectId: 'jw8lakl8',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('article').title('Articles'),
            S.documentTypeListItem('trackerLaw').title('Tracker Laws'),
            S.divider()
          ])
    }),
    visionTool()
  ],
  schema: { types: schemaTypes }
});
