import { describe, expect, it } from "vitest";

import type { GMapPlace } from "../src/external/googleMap/places/type.common";

import { PlaceLib } from "../src/lib/place";

const tokyoTower: GMapPlace = {
  displayName: { text: "Tokyo Tower" },
  formattedAddress: "4 Chome-2-8 Shibakoen, Minato City",
  googleMapsUri: "https://maps.google.com/?cid=123",
  id: "place-123",
  location: { latitude: 35.6586, longitude: 139.7454 },
  rating: 4.5,
  userRatingCount: 1000,
};

describe("PlaceLib", () => {
  describe("haversineMeters", () => {
    it("returns 0 for the same point", () => {
      expect(PlaceLib.haversineMeters(35.0, 139.0, 35.0, 139.0)).toBe(0);
    });

    it("returns ~111195 m for 1 degree of longitude at the equator", () => {
      const result = PlaceLib.haversineMeters(0, 0, 0, 1);
      expect(result).toBeGreaterThanOrEqual(110_700);
      expect(result).toBeLessThanOrEqual(111_700);
    });

    it("is symmetric (A→B equals B→A)", () => {
      const ab = PlaceLib.haversineMeters(35.68, 139.77, 34.68, 135.49);
      const ba = PlaceLib.haversineMeters(34.68, 135.49, 35.68, 139.77);
      expect(ab).toBe(ba);
    });
  });

  describe("cacheKey", () => {
    it("generates a deterministic URL-like key", () => {
      expect(PlaceLib.cacheKey("nearby", "lat=35.0&lng=139.0")).toBe(
        "https://slim-portal-places-cache/nearby/lat=35.0&lng=139.0",
      );
    });
  });

  describe("mapPlaceToItem", () => {
    it("maps all fields correctly when lat/lng are provided", () => {
      const item = PlaceLib.mapPlaceToItem(tokyoTower, 35.6812, 139.7671);
      expect(item).toMatchObject({
        address: "4 Chome-2-8 Shibakoen, Minato City",
        id: "place-123",
        lat: 35.6586,
        lng: 139.7454,
        mapsUrl: "https://maps.google.com/?cid=123",
        name: "Tokyo Tower",
        rating: 4.5,
        totalRatings: 1000,
      });
      expect(item.distanceMeters).toBeTypeOf("number");
      expect(item.distanceMeters).toBeGreaterThan(0);
    });

    it("sets distanceMeters to null when lat/lng are null", () => {
      expect(PlaceLib.mapPlaceToItem(tokyoTower, null, null).distanceMeters).toBeNull();
    });

    it("sets distanceMeters to null when place has no location", () => {
      const noLocation: GMapPlace = { ...tokyoTower, location: undefined };
      expect(PlaceLib.mapPlaceToItem(noLocation, 35.0, 139.0).distanceMeters).toBeNull();
    });

    it("falls back to empty strings and nulls for a minimal place object", () => {
      const item = PlaceLib.mapPlaceToItem({}, null, null);
      expect(item.address).toBe("");
      expect(item.mapsUrl).toBe("");
      expect(item.name).toBe("");
      expect(item.id).toBeNull();
      expect(item.rating).toBeNull();
      expect(item.totalRatings).toBe(0);
    });
  });
});
