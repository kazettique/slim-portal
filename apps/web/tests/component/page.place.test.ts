// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import PlacePage from "../../src/pages/place.astro";

describe("Place page", () => {
  it("renders the page heading", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PlacePage);
    expect(result).toContain("Places");
  });

  it("renders the search form", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PlacePage);
    expect(result).toContain("<form");
  });

  it("renders the search input", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PlacePage);
    expect(result).toContain("<input");
  });
});
