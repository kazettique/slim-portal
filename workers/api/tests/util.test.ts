import { describe, expect, it } from "vitest";

import { WorkerUtil } from "../src/util";

describe("WorkerUtil", () => {
  describe("corsHeaders", () => {
    const allowed = "http://localhost:4321";

    it("returns CORS headers when origin matches allowedOriginDev", () => {
      const headers = WorkerUtil.corsHeaders(allowed, allowed);
      expect(headers).toMatchObject({
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": expect.stringContaining("GET"),
        "Access-Control-Allow-Origin": allowed,
      });
    });

    it("returns empty object when origin does not match", () => {
      expect(WorkerUtil.corsHeaders("https://evil.com", allowed)).toEqual({});
    });

    it("returns empty object when origin is null", () => {
      expect(WorkerUtil.corsHeaders(null, allowed)).toEqual({});
    });

    it("returns empty object when allowedOriginDev is empty string", () => {
      expect(WorkerUtil.corsHeaders(allowed, "")).toEqual({});
    });
  });
});
