import { describe, expect, it } from "vitest";

import { ShareValidator } from "../src/validator";

const validNews = {
  publishedAt: "2024-06-01",
  source: "NHK",
  summary: "A test summary.",
  title: "Test title",
  url: "https://www.nhk.or.jp/news/article/123",
};

const validPlace = {
  address: "1-1 Chiyoda, Tokyo",
  distanceMeters: 500,
  id: "place-123",
  lat: 35.68,
  lng: 139.77,
  mapsUrl: "https://maps.google.com/?cid=123",
  name: "Tokyo Station",
  rating: 4.5,
  totalRatings: 1000,
};

describe("ShareValidator", () => {
  describe("NEWS_ITEM_VALIDATOR", () => {
    it("accepts a valid NewsItem", () => {
      expect(ShareValidator.NEWS_ITEM_VALIDATOR.safeParse(validNews).success).toBe(true);
    });

    it("rejects when title is missing", () => {
      const { title: _, ...noTitle } = validNews;
      expect(ShareValidator.NEWS_ITEM_VALIDATOR.safeParse(noTitle).success).toBe(false);
    });

    it("rejects an invalid URL", () => {
      expect(
        ShareValidator.NEWS_ITEM_VALIDATOR.safeParse({ ...validNews, url: "not-a-url" }).success,
      ).toBe(false);
    });

    it("rejects an invalid publishedAt format", () => {
      expect(
        ShareValidator.NEWS_ITEM_VALIDATOR.safeParse({
          ...validNews,
          publishedAt: "June 1, 2024",
        }).success,
      ).toBe(false);
    });

    it("accepts an empty summary string", () => {
      expect(
        ShareValidator.NEWS_ITEM_VALIDATOR.safeParse({ ...validNews, summary: "" }).success,
      ).toBe(true);
    });
  });

  describe("PLACE_ITEM_VALIDATOR", () => {
    it("accepts a valid PlaceItem", () => {
      expect(ShareValidator.PLACE_ITEM_VALIDATOR.safeParse(validPlace).success).toBe(true);
    });

    it("accepts null for nullable fields", () => {
      const nullPlace = {
        ...validPlace,
        distanceMeters: null,
        id: null,
        lat: null,
        lng: null,
        rating: null,
      };
      expect(ShareValidator.PLACE_ITEM_VALIDATOR.safeParse(nullPlace).success).toBe(true);
    });

    it("rejects distanceMeters that is not an integer", () => {
      expect(
        ShareValidator.PLACE_ITEM_VALIDATOR.safeParse({ ...validPlace, distanceMeters: 1.5 })
          .success,
      ).toBe(false);
    });

    it("rejects negative totalRatings", () => {
      expect(
        ShareValidator.PLACE_ITEM_VALIDATOR.safeParse({ ...validPlace, totalRatings: -1 }).success,
      ).toBe(false);
    });

    it("rejects when a required field is missing", () => {
      const { name: _, ...noName } = validPlace;
      expect(ShareValidator.PLACE_ITEM_VALIDATOR.safeParse(noName).success).toBe(false);
    });
  });
});
