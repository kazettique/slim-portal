// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';

import PlaceDetailPage from '../../src/pages/place/detail.astro';

describe('Place detail page', () => {
  it('renders the back link', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PlaceDetailPage);
    expect(result).toContain('← Back');
    expect(result).toContain('id="back-link"');
  });
});
