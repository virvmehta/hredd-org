import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://hredd.org',
  integrations: [sitemap()],
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory'
  }
});
