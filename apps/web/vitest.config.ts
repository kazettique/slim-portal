import { getViteConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

export default getViteConfig(
  {
    test: {
      name: 'web',
      environmentMatchGlobs: [
        ['tests/component/page.*.test.ts', 'node'],
        ['**', 'happy-dom'],
      ],
      include: ['tests/**/*.test.ts'],
      setupFiles: ['tests/setup.ts'],
    },
  },
  { root: fileURLToPath(new URL('.', import.meta.url)) },
);
