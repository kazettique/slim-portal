import { describe, expect, it } from "vitest";

import { TimeFormat } from "../../src/type.settings";
import { AppUtil } from "../../src/util";

describe("AppUtil", () => {
  describe("formatCacheTime", () => {
    // Construct dates via local-time constructor so results are timezone-independent.
    it("formats in 24h by default", () => {
      const iso = new Date(2024, 5, 1, 14, 5).toISOString();
      expect(AppUtil.formatCacheTime(iso)).toBe("Cached at 14:05");
    });

    it("formats in 12h when requested", () => {
      const iso = new Date(2024, 5, 1, 14, 5).toISOString();
      expect(AppUtil.formatCacheTime(iso, TimeFormat.TWELVE_HOUR)).toBe("Cached at 2:05 PM");
    });

    it("uses 12 (not 0) for noon in 12h format", () => {
      const iso = new Date(2024, 5, 1, 12, 0).toISOString();
      expect(AppUtil.formatCacheTime(iso, TimeFormat.TWELVE_HOUR)).toBe("Cached at 12:00 PM");
    });

    it("uses 12 for midnight in 12h format", () => {
      const iso = new Date(2024, 5, 1, 0, 0).toISOString();
      expect(AppUtil.formatCacheTime(iso, TimeFormat.TWELVE_HOUR)).toBe("Cached at 12:00 AM");
    });
  });

  describe("formatDate", () => {
    it("returns a non-empty string for a valid ISO date", () => {
      const result = AppUtil.formatDate(new Date(2024, 5, 1, 9, 0).toISOString());
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });

    it("returns a string for invalid input (does not throw)", () => {
      expect(() => AppUtil.formatDate("not-a-date")).not.toThrow();
    });
  });

  describe("formatDistance", () => {
    it("returns empty string for null", () => {
      expect(AppUtil.formatDistance(null)).toBe("");
    });

    it("formats meters when under 1000", () => {
      expect(AppUtil.formatDistance(500)).toBe(" · 500m");
    });

    it("formats as km when 1000 or more", () => {
      expect(AppUtil.formatDistance(1500)).toBe(" · 1.5km");
      expect(AppUtil.formatDistance(1000)).toBe(" · 1.0km");
    });
  });

  describe("formatDistanceKm", () => {
    it("shows 2 decimal places when under 1 km", () => {
      expect(AppUtil.formatDistanceKm(0.5)).toBe(" · 0.50 km");
    });

    it("shows 1 decimal place when 1 km or more", () => {
      expect(AppUtil.formatDistanceKm(1.5)).toBe(" · 1.5 km");
    });
  });

  describe("formatKb", () => {
    it('returns "0 KB" for 0 bytes', () => {
      expect(AppUtil.formatKb(0)).toBe("0 KB");
    });

    it("formats as KB for small values", () => {
      expect(AppUtil.formatKb(1024)).toBe("1.0 KB");
      expect(AppUtil.formatKb(102400)).toBe("100.0 KB");
    });

    it("formats as MB for large values", () => {
      expect(AppUtil.formatKb(1024 * 1024)).toBe("1.00 MB");
    });
  });

  describe("formatRating", () => {
    it('returns "No rating" for null', () => {
      expect(AppUtil.formatRating(null, 0)).toBe("No rating");
    });

    it("formats rating and review count", () => {
      expect(AppUtil.formatRating(4.5, 1000)).toBe("★ 4.5 · 1,000 reviews");
    });

    it("uses one decimal place for rating", () => {
      expect(AppUtil.formatRating(4, 5)).toBe("★ 4.0 · 5 reviews");
    });
  });

  describe("statusClass", () => {
    it("returns base class for null status", () => {
      expect(AppUtil.statusClass(null)).toBe("place-details__status");
    });

    it("returns open modifier for OPERATIONAL", () => {
      expect(AppUtil.statusClass("OPERATIONAL")).toBe(
        "place-details__status place-details__status--open",
      );
    });

    it("returns closed modifier for CLOSED_TEMPORARILY", () => {
      expect(AppUtil.statusClass("CLOSED_TEMPORARILY")).toBe(
        "place-details__status place-details__status--closed",
      );
    });

    it("returns base class for unknown status", () => {
      expect(AppUtil.statusClass("UNKNOWN")).toBe("place-details__status");
    });
  });

  describe("toDatetimeLocalValue", () => {
    it("formats using local time components", () => {
      // Use local-time constructor — getFullYear/Month/Date/Hours/Minutes all match
      const date = new Date(2024, 5, 1, 14, 30); // local: June 1 2024, 14:30
      expect(AppUtil.toDatetimeLocalValue(date)).toBe("2024-06-01T14:30");
    });

    it("zero-pads single-digit month, day, hour, minute", () => {
      const date = new Date(2024, 0, 5, 9, 5); // local: Jan 5 2024, 09:05
      expect(AppUtil.toDatetimeLocalValue(date)).toBe("2024-01-05T09:05");
    });
  });
});
