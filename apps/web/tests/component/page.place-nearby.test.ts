// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import PlaceNearbyPage from "../../src/pages/place/nearby.astro";

describe("Place nearby page", () => {
  it("renders the page heading", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PlaceNearbyPage);
    expect(result).toContain("Nearby");
  });

  it("renders the radius selector", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PlaceNearbyPage);
    expect(result).toContain("<select");
  });
});
