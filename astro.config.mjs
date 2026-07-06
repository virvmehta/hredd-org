import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://hredd.org',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory'
  }
});
