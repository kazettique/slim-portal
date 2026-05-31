import { getViteConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import type {} from 'vitest/config';

export default getViteConfig(
  {
    test: {
      name: 'web',
      environment: 'happy-dom',
      include: ['tests/**/*.test.ts'],
      setupFiles: ['tests/setup.ts'],
    },
  },
  { root: fileURLToPath(new URL('.', import.meta.url)) },
);
