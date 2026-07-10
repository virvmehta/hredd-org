import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://hredd.org',
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
