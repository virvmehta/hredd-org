import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas/index.js';

export default defineConfig({
  name: 'hredd-org',
  title: 'hredd.org',
  projectId: 'jw8lak18',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            S.listItem()
              .title('Articles')
              .child(S.documentTypeList('article').title('Articles')),
            S.listItem()
              .title('Tracker Laws')
              .child(S.documentTypeList('trackerLaw').title('Tracker Laws')),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
