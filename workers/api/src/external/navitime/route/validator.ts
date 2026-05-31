import { z } from "zod/v4";

import type {
  NavitimeMoveSection,
  NavitimePointSection,
  NavitimeTransitResponse,
  TransitSearchRequest,
} from "./type";

import { NavitimeLang, NavitimeSortOrder } from "../type.common";
import { NavitimeCommonValidator } from "../validator.common";

export abstract class NavitimeValidator {
  private static readonly LAT_LNG_PATTERN: RegExp = /^-?\d{1,3}(\.\d+)?,-?\d{1,3}(\.\d+)?$/;

  // ── Response sub-validators ────────────────────────────────────────────────

  public static readonly REQUEST_VALIDATOR: z.ZodType<TransitSearchRequest> = z.object({
    datetime: z.iso.datetime({ local: true, offset: false }).optional(),
    from: z.string().regex(this.LAT_LNG_PATTERN, "must be 'lat,lng'"),
    lang: z.enum(NavitimeLang).optional(),
    limit: z.coerce.number().int().min(1).max(10).optional(),
    order: z.enum(NavitimeSortOrder).optional(),
    to: z.string().regex(this.LAT_LNG_PATTERN, "must be 'lat,lng'"),
  });

  private static readonly FARE_DETAIL_VALIDATOR = z.object({
    fare: z.number(),
    goal: z.object({ name: z.string(), node_id: z.string() }),
    id: z.string(),
    start: z.object({ name: z.string(), node_id: z.string() }),
  });

  private static readonly LINK_STATION_VALIDATOR = z.object({
    id: z.string(),
    name: z.string(),
  });

  private static readonly TRANSPORT_LINK_VALIDATOR = z.object({
    destination: this.LINK_STATION_VALIDATOR.optional(),
    direction: z.string().optional(),
    from: this.LINK_STATION_VALIDATOR.optional(),
    id: z.string(),
    is_timetable: z.string().optional(),
    name: z.string(),
    to: this.LINK_STATION_VALIDATOR.optional(),
    way: z.string().optional(),
  });

  private static readonly NAVITIME_TRANSPORT_VALIDATOR = z.object({
    color: z.string().optional(),
    company: z.object({ id: z.string(), name: z.string() }).optional(),
    destination: z.object({ name: z.string() }).optional(),
    fare: z.record(z.string(), z.number()).optional(),
    fare_break: z.record(z.string(), z.boolean()).optional(),
    fare_detail: this.FARE_DETAIL_VALIDATOR.array().optional(),
    fare_season: z.string().optional(),
    getoff: z.string().optional(),
    id: z.string().optional(),
    links: this.TRANSPORT_LINK_VALIDATOR.array().optional(),
    name: z.string().optional(),
    type: z.string().optional(),
  });

  private static readonly MOVE_SECTION_VALIDATOR: z.ZodType<NavitimeMoveSection> = z.object({
    distance: z.number().optional(),
    from_time: z.string().optional(),
    line_name: z.string().optional(),
    move: z.string().optional(),
    time: z.number().optional(),
    to_time: z.string().optional(),
    transport: this.NAVITIME_TRANSPORT_VALIDATOR.optional(),
    type: z.literal("move"),
  });

  private static readonly POINT_SECTION_VALIDATOR: z.ZodType<NavitimePointSection> = z.object({
    coord: NavitimeCommonValidator.COORD_VALIDATOR.optional(),
    gateway: z.string().optional(),
    name: z.string().optional(),
    node_id: z.string().optional(),
    node_types: z.string().array().optional(),
    numbering: z
      .object({
        arrival: z.object({ number: z.string(), symbol: z.string() }).array().optional(),
        departure: z.object({ number: z.string(), symbol: z.string() }).array().optional(),
      })
      .optional(),
    type: z.literal("point"),
  });

  private static readonly SECTION_VALIDATOR = z.discriminatedUnion("type", [
    this.POINT_SECTION_VALIDATOR as z.ZodObject<{ type: z.ZodLiteral<"point"> }>,
    this.MOVE_SECTION_VALIDATOR as z.ZodObject<{ type: z.ZodLiteral<"move"> }>,
  ]);

  private static readonly SUMMARY_ENDPOINT_VALIDATOR = z.object({
    coord: NavitimeCommonValidator.COORD_VALIDATOR.optional(),
    name: z.string(),
    type: z.literal("point"),
  });

  private static readonly SUMMARY_MOVE_VALIDATOR = z.object({
    distance: z.number().optional(),
    fare: z.record(z.string(), z.number()).optional(),
    from_time: z.string(),
    move_type: z.string().array().optional(),
    reference_fare: z
      .object({ lowest_total_ic: z.number(), lowest_total_ticket: z.number() })
      .optional(),
    time: z.number(),
    to_time: z.string(),
    transit_count: z.number(),
    type: z.string().optional(),
    walk_distance: z.number().optional(),
  });

  private static readonly ROUTE_ITEM_VALIDATOR = z.object({
    sections: this.SECTION_VALIDATOR.array(),
    summary: z.object({
      goal: this.SUMMARY_ENDPOINT_VALIDATOR.optional(),
      move: this.SUMMARY_MOVE_VALIDATOR,
      no: z.string(),
      start: this.SUMMARY_ENDPOINT_VALIDATOR.optional(),
    }),
  });

  // ── Public validators ──────────────────────────────────────────────────────

  private static readonly ROUTE_UNIT_VALIDATOR = z.object({
    coord_unit: z.string(),
    currency: z.string(),
    datum: z.string(),
    distance: z.string(),
    time: z.string(),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<NavitimeTransitResponse> = z.object({
    items: this.ROUTE_ITEM_VALIDATOR.array(),
    unit: this.ROUTE_UNIT_VALIDATOR.optional(),
  });
}
