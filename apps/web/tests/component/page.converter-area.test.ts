// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import AreaConverterPage from "../../src/pages/converter/area-converter.astro";

describe("Area converter page", () => {
  it("renders the page heading", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(AreaConverterPage);
    expect(result).toContain("面積換算");
  });

  it("renders the tatami type selector", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(AreaConverterPage);
    expect(result).toContain("<select");
  });

  it("renders the tsubo input", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(AreaConverterPage);
    expect(result).toContain('id="area-tsubo"');
  });
});
