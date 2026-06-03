import { describe, expect, it } from "vitest";

import { JapaneseEra } from "../../src/type.converter";
import { AreaConverterUtil, YearConverterUtil } from "../../src/util.converter";

describe("YearConverterUtil", () => {
  describe("eraToWestern", () => {
    it("returns null for eraYear < 1", () => {
      expect(YearConverterUtil.eraToWestern(JapaneseEra.Reiwa, 0)).toBeNull();
    });

    it("returns null for unknown era name", () => {
      expect(YearConverterUtil.eraToWestern("Unknown" as JapaneseEra, 1)).toBeNull();
    });

    it("maps Meiji 1 to 1868", () => {
      expect(YearConverterUtil.eraToWestern(JapaneseEra.Meiji, 1)).toBe(1868);
    });

    it("maps Meiji 45 to 1912", () => {
      expect(YearConverterUtil.eraToWestern(JapaneseEra.Meiji, 45)).toBe(1912);
    });

    it("maps Reiwa 1 to 2019", () => {
      expect(YearConverterUtil.eraToWestern(JapaneseEra.Reiwa, 1)).toBe(2019);
    });

    it("maps Reiwa 6 to 2024", () => {
      expect(YearConverterUtil.eraToWestern(JapaneseEra.Reiwa, 6)).toBe(2024);
    });
  });

  describe("rocToWestern", () => {
    it("maps ROC 1 to 1912", () => {
      expect(YearConverterUtil.rocToWestern(1)).toBe(1912);
    });

    it("maps ROC 113 to 2024", () => {
      expect(YearConverterUtil.rocToWestern(113)).toBe(2024);
    });
  });

  describe("westernToRoc", () => {
    it("returns null for years before 1912", () => {
      expect(YearConverterUtil.westernToRoc(1911)).toBeNull();
      expect(YearConverterUtil.westernToRoc(1868)).toBeNull();
    });

    it("maps 1912 to ROC 1", () => {
      expect(YearConverterUtil.westernToRoc(1912)).toBe(1);
    });

    it("maps 2024 to ROC 113", () => {
      expect(YearConverterUtil.westernToRoc(2024)).toBe(113);
    });
  });

  describe("westernToEra", () => {
    it("returns null for years before Meiji (< 1868)", () => {
      expect(YearConverterUtil.westernToEra(1867)).toBeNull();
    });

    it("maps 1868 to Meiji 1", () => {
      const result = YearConverterUtil.westernToEra(1868);
      expect(result?.era.name).toBe("Meiji");
      expect(result?.eraYear).toBe(1);
    });

    it("maps 2019 to 令和 1 (prefers newer era on transition year)", () => {
      const result = YearConverterUtil.westernToEra(2019);
      expect(result?.era.name).toBe("Reiwa");
      expect(result?.eraYear).toBe(1);
    });

    it("maps 2024 to 令和 6", () => {
      const result = YearConverterUtil.westernToEra(2024);
      expect(result?.era.name).toBe("Reiwa");
      expect(result?.eraYear).toBe(6);
    });

    it("maps 1989 to 平成 1 (prefers newer era)", () => {
      const result = YearConverterUtil.westernToEra(1989);
      expect(result?.era.name).toBe("Heisei");
      expect(result?.eraYear).toBe(1);
    });

    it("maps 1945 to 昭和 20", () => {
      const result = YearConverterUtil.westernToEra(1945);
      expect(result?.era.name).toBe("Showa");
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
