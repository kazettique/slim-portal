// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import TransitPage from "../../src/pages/transit.astro";

describe("Transit page", () => {
  it("renders the page heading", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TransitPage);
    expect(result).toContain("Transit");
  });

  it("renders the route form", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TransitPage);
    expect(result).toContain("<form");
  });

  it("renders the From label", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TransitPage);
    expect(result).toContain("From");
  });
});
