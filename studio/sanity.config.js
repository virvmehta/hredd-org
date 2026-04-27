import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas/index.js';

export default defineConfig({
  name: 'hredd-org',
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
              .title('Laws')
              .child(S.documentTypeList('law').title('Laws')),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
