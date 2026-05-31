import type {} from "vitest/config";

import { getViteConfig } from "astro/config";
import { fileURLToPath } from "node:url";

export default getViteConfig(
  {
    test: {
      environment: "happy-dom",
      include: ["tests/**/*.test.ts"],
      name: "web",
      setupFiles: ["tests/setup.ts"],
    },
  },
  { root: fileURLToPath(new URL(".", import.meta.url)) },
);
