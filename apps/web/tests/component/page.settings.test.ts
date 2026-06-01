// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import SettingsPage from "../../src/pages/settings.astro";

describe("Settings page", () => {
  it("renders the page heading", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(SettingsPage);
    expect(result).toContain("Settings");
  });

  it("renders radio inputs for theme selection", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(SettingsPage);
    expect(result).toContain('type="radio"');
  });
});
