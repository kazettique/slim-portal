// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import OfflinePage from "../../src/pages/offline.astro";

describe("Offline page", () => {
  it("renders the offline heading", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(OfflinePage);
    expect(result).toContain("You&#39;re offline");
  });
});
