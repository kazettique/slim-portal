// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import TransitDetailPage from "../../src/pages/transit/detail.astro";

describe("Transit detail page", () => {
  it("renders the back link to bookmarks", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TransitDetailPage);
    expect(result).toContain("← Bookmarks");
    expect(result).toContain('href="/bookmark"');
  });
});
