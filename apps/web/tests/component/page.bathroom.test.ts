// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import BathroomPage from "../../src/pages/bathroom.astro";

describe("Bathroom page", () => {
  it("renders the page heading", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BathroomPage);
    expect(result).toContain("Bathrooms");
  });

  it("renders the radius selector", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BathroomPage);
    expect(result).toContain("<select");
  });

  it("renders the search button", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BathroomPage);
    expect(result).toContain("Search");
  });
});
