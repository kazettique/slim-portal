import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://slim-portal.pages.dev',
  compressHTML: true,
  build: {
    inlineStylesheets: 'never',
  },
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8787',
          changeOrigin: true,
        },
      },
    },
  },
});
