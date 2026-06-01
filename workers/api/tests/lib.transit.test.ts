import { describe, expect, it } from "vitest";

import type { NavitimeSection } from "../src/external/navitime/route/type";
import type { NavitimeTransportNode } from "../src/external/navitime/transport/type";

import { TransitLib } from "../src/lib/transit";

describe("TransitLib", () => {
  describe("toJSTString", () => {
    it("converts UTC to JST (UTC+9)", () => {
      // 05:00 UTC = 14:00 JST
      expect(TransitLib.toJSTString(new Date("2024-06-01T05:00:00.000Z"))).toBe(
        "2024-06-01T14:00:00",
      );
    });

    it("handles midnight rollover (UTC to next day JST)", () => {
      // 15:00 UTC = 00:00 JST next day
      expect(TransitLib.toJSTString(new Date("2024-06-01T15:00:00.000Z"))).toBe(
        "2024-06-02T00:00:00",
      );
    });
  });

  describe("roundToHour", () => {
    it("truncates minutes and seconds to 00:00", () => {
      expect(TransitLib.roundToHour("2024-06-01T14:37:00")).toBe("2024-06-01T14:00:00");
    });

    it("leaves an already-on-the-hour string unchanged", () => {
      expect(TransitLib.roundToHour("2024-06-01T09:00:00")).toBe("2024-06-01T09:00:00");
    });
  });

  describe("mapNode", () => {
    it("maps NavitimeTransportNode fields and renames lon → lng", () => {
      const node: NavitimeTransportNode = {
        coord: { lat: 35.68, lon: 139.77 },
        id: "node-tokyo",
        name: "東京",
        ruby: "トウキョウ",
        types: ["train"],
      };
      expect(TransitLib.mapNode(node)).toEqual({
        coord: { lat: 35.68, lng: 139.77 },
        id: "node-tokyo",
        name: "東京",
        ruby: "トウキョウ",
        types: ["train"],
      });
    });

    it("passes through undefined ruby", () => {
      const node: NavitimeTransportNode = {
        coord: { lat: 35.0, lon: 139.0 },
        id: "n1",
        name: "Station",
        types: [],
      };
      expect(TransitLib.mapNode(node).ruby).toBeUndefined();
    });
  });

  describe("mapSections", () => {
    const point = (name: string): NavitimeSection => ({ name, type: "point" });
    const move = (from_time = "10:00", to_time = "10:15"): NavitimeSection => ({
      distance: 500,
      from_time,
      time: 15,
      to_time,
      transport: { color: "#f00", name: "JR" },
      type: "move",
    });

    it("produces one leg from [point, move, point]", () => {
      const legs = TransitLib.mapSections([point("A"), move(), point("B")]);
      expect(legs).toHaveLength(1);
      expect(legs[0]).toMatchObject({
        arrive: "10:15",
        color: "#f00",
        depart: "10:00",
        from: "A",
        line: "JR",
        to: "B",
      });
    });

    it("produces two legs from [point, move, point, move, point]", () => {
      const legs = TransitLib.mapSections([
        point("A"),
        move("10:00", "10:15"),
        point("B"),
        move("10:20", "10:35"),
        point("C"),
      ]);
      expect(legs).toHaveLength(2);
      expect(legs[0]).toMatchObject({ from: "A", to: "B" });
      expect(legs[1]).toMatchObject({ from: "B", to: "C" });
    });

    it("returns empty legs when no move sections exist", () => {
      expect(TransitLib.mapSections([point("A"), point("B")])).toHaveLength(0);
    });

    it("uses empty strings for from/to when move has no adjacent point sections", () => {
      const legs = TransitLib.mapSections([move()]);
      expect(legs[0]).toMatchObject({ from: "", to: "" });
    });
  });
});
