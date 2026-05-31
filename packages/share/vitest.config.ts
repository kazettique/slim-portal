import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'share',
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
