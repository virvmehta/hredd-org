import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://hredd.org',
  // English stays at the root; additional languages are prefixed (e.g. /bn/).
  // Bangla is the first, added partially as an accessibility pilot.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'bn'],
    routing: { prefixDefaultLocale: false }
  },
  integrations: [sitemap({
    filter: (page) => !page.includes('/buyer-compliance/') &&
      !(/\/tracker\/.+\//.test(new URL(page).pathname))
  })],
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory'
  }
});
