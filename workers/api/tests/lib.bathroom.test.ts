import { describe, expect, it } from "vitest";

import { BathroomLib } from "../src/lib/bathroom";

describe("BathroomLib", () => {
  describe("extractArray", () => {
    it("returns a bare array as-is", () => {
      const arr = [1, 2, 3];
      expect(BathroomLib.extractArray(arr)).toBe(arr);
    });

    it("extracts an array nested inside an object", () => {
      expect(BathroomLib.extractArray({ count: 3, data: [1, 2, 3] })).toEqual([1, 2, 3]);
    });

    it("returns empty array for an object with no array values", () => {
      expect(BathroomLib.extractArray({ message: "ok" })).toEqual([]);
    });

    it("returns empty array for null", () => {
      expect(BathroomLib.extractArray(null)).toEqual([]);
    });

    it("returns empty array for primitive values", () => {
      expect(BathroomLib.extractArray("string")).toEqual([]);
      expect(BathroomLib.extractArray(42)).toEqual([]);
    });
  });

  describe("cacheKey", () => {
    it("generates a deterministic key from coordinates and radius", () => {
      expect(BathroomLib.cacheKey(35.0, 139.0, 0.5)).toBe(
        "https://slim-portal-bathrooms-cache/nearby/lat=35&lng=139&radius=0.5",
      );
    });
  });
});
