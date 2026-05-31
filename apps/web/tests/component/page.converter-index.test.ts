// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';

import ConverterIndexPage from '../../src/pages/converter/index.astro';

describe('Converter index page', () => {
  it('renders the page heading', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ConverterIndexPage);
    expect(result).toContain('Convert');
  });

  it('renders a list of converters', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ConverterIndexPage);
    expect(result).toContain('<ul');
  });
});
