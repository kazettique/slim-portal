// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import NewsPage from "../../src/pages/news.astro";

describe("News page", () => {
  it("renders the page heading", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(NewsPage);
    expect(result).toContain("News");
  });

  it("renders the refresh button", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(NewsPage);
    expect(result).toContain("Refresh");
    expect(result).toContain("<button");
  });
});
