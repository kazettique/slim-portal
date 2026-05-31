// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';

import BookmarkPage from '../../src/pages/bookmark.astro';

describe('Bookmark page', () => {
  it('renders the page heading', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BookmarkPage);
    expect(result).toContain('Bookmarks');
  });

  it('renders the delete all button', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BookmarkPage);
    expect(result).toContain('Delete all');
  });
});
