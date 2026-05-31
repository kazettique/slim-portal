import { defineConfig } from "astro/config";

export default defineConfig({
  build: {
    inlineStylesheets: "never",
  },
  compressHTML: true,
  output: "static",
  site: "https://slim-portal.pages.dev",
  vite: {
    server: {
      proxy: {
        "/api": {
          changeOrigin: true,
          target: "http://localhost:8787",
        },
      },
    },
  },
});
