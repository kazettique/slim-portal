import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      "packages/share/vitest.config.ts",
      "workers/api/vitest.config.ts",
      "apps/web/vitest.config.ts",
    ],
  },
});
