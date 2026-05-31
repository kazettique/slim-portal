import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';

import SearchPage from '../../src/pages/search.astro';

describe('Search page', () => {
  it('renders the search form', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(SearchPage);
    expect(result).toContain('<form');
  });

  it('renders the search input', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(SearchPage);
    expect(result).toContain('<input');
  });

  it('renders the submit button', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(SearchPage);
    expect(result).toContain('Search');
  });
});
