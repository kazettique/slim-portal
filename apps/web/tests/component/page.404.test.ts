// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';

import NotFoundPage from '../../src/pages/404.astro';

describe('404 page', () => {
  it('renders the not-found heading', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(NotFoundPage);
    expect(result).toContain('Page not found');
  });
});
