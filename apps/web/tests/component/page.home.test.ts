import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';

import HomePage from '../../src/pages/index.astro';

describe('Home page', () => {
  it('renders the app title', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HomePage);
    expect(result).toContain('Slim Portal');
  });

  it('renders nav link for News', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HomePage);
    expect(result).toContain('News');
  });

  it('renders nav link for Search', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HomePage);
    expect(result).toContain('Search');
  });

  it('renders nav link for Transit', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HomePage);
    expect(result).toContain('Transit');
  });
});
