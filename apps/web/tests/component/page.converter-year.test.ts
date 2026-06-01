// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import YearConverterPage from "../../src/pages/converter/year-converter.astro";

describe("Year converter page", () => {
  it("renders the western year input", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(YearConverterPage);
    expect(result).toContain('id="year-western"');
  });

  it("renders the era selector", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(YearConverterPage);
    expect(result).toContain("<select");
    expect(result).toContain("令和");
  });

  it("renders the Western label", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(YearConverterPage);
    expect(result).toContain("Western");
  });
});
