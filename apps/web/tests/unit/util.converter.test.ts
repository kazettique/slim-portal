import { describe, expect, it } from "vitest";

import { AreaConverterUtil, YearConverterUtil } from "../../src/util.converter";

describe("YearConverterUtil", () => {
  describe("westernToEra", () => {
    it("returns null for years before Meiji (< 1868)", () => {
      expect(YearConverterUtil.westernToEra(1867)).toBeNull();
    });

    it("maps 1868 to Meiji 1", () => {
      const result = YearConverterUtil.westernToEra(1868);
      expect(result?.era.name).toBe("明治");
      expect(result?.eraYear).toBe(1);
    });

    it("maps 2019 to 令和 1 (prefers newer era on transition year)", () => {
      const result = YearConverterUtil.westernToEra(2019);
      expect(result?.era.name).toBe("令和");
      expect(result?.eraYear).toBe(1);
    });

    it("maps 2024 to 令和 6", () => {
      const result = YearConverterUtil.westernToEra(2024);
      expect(result?.era.name).toBe("令和");
      expect(result?.eraYear).toBe(6);
    });

    it("maps 1989 to 平成 1 (prefers newer era)", () => {
      const result = YearConverterUtil.westernToEra(1989);
      expect(result?.era.name).toBe("平成");
      expect(result?.eraYear).toBe(1);
    });

    it("maps 1945 to 昭和 20", () => {
      const result = YearConverterUtil.westernToEra(1945);
      expect(result?.era.name).toBe("昭和");
      expect(result?.eraYear).toBe(20);
    });
  });
});

describe("AreaConverterUtil", () => {
  describe("getTatamiM2", () => {
    it("parses a numeric string", () => {
      expect(AreaConverterUtil.getTatamiM2("1.62")).toBeCloseTo(1.62);
    });

    it("falls back to 1.62 for empty string", () => {
      expect(AreaConverterUtil.getTatamiM2("")).toBeCloseTo(1.62);
    });
  });

  describe("round", () => {
    it("rounds to given decimal places", () => {
      expect(AreaConverterUtil.round(1.2345, 2)).toBe("1.23");
    });

    it("zero decimal places returns integer string", () => {
      expect(AreaConverterUtil.round(3.7, 0)).toBe("4");
    });
  });

  describe("TSUBO_TO_SQM", () => {
    it("equals 400/121 exactly", () => {
      expect(AreaConverterUtil.TSUBO_TO_SQM).toBeCloseTo(400 / 121);
    });
  });
});
