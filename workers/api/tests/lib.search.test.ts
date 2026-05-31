import { describe, expect, it } from "vitest";

import type { DdgResponse } from "../src/external/duckduckgo/type";

import { SearchLib } from "../src/lib/search";

const makeDdgResult = (i: number) => ({
  description: `Snippet ${i}`,
  description_html: `<p>Snippet ${i}</p>`,
  host: "example.com",
  position: i,
  sublinks: [],
  title: `Title ${i}`,
  types: "A",
  url: `https://example.com/${i}`,
});

describe("SearchLib", () => {
  describe("cacheKey", () => {
    it("URL-encodes the query string", () => {
      expect(SearchLib.cacheKey("hello world")).toBe(
        "https://slim-portal-search-cache/hello%20world",
      );
    });

    it("encodes special characters", () => {
      expect(SearchLib.cacheKey("foo+bar")).toBe("https://slim-portal-search-cache/foo%2Bbar");
    });
  });

  describe("mapResults", () => {
    it("maps DdgResult fields to SearchItem", () => {
      const data: DdgResponse = { query: "test", results: [makeDdgResult(1)], status: "ok" };
      const items = SearchLib.mapResults(data);
      expect(items).toHaveLength(1);
      expect(items[0]).toEqual({
        snippet: "Snippet 1",
        title: "Title 1",
        url: "https://example.com/1",
      });
    });

    it("returns empty array for empty results", () => {
      const data: DdgResponse = { query: "test", results: [], status: "ok" };
      expect(SearchLib.mapResults(data)).toHaveLength(0);
    });

    it("limits output to 20 results (MAX_RESULTS)", () => {
      const data: DdgResponse = {
        query: "test",
        results: Array.from({ length: 25 }, (_, i) => makeDdgResult(i)),
        status: "ok",
      };
      expect(SearchLib.mapResults(data).length).toBeLessThanOrEqual(20);
    });
  });
});
