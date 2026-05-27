import { z } from "zod/v4";
import { NavitimeLang, NavitimeSortOrder } from "../type.common";
import { NavitimeCommonValidator } from "../validator.common";
import {
  NavitimeTransitResponse,
  NavitimeMoveSection,
  NavitimePointSection,
  TransitSearchRequest,
} from "./type";

export abstract class NavitimeValidator {
  private static readonly LAT_LNG_PATTERN: RegExp = /^-?\d{1,3}(\.\d+)?,-?\d{1,3}(\.\d+)?$/;

  // ── Response sub-validators ────────────────────────────────────────────────

  private static readonly LINK_STATION_VALIDATOR = z.object({
    id: z.string(),
    name: z.string(),
  });

  private static readonly FARE_DETAIL_VALIDATOR = z.object({
    id: z.string(),
    fare: z.number(),
    start: z.object({ name: z.string(), node_id: z.string() }),
    goal: z.object({ name: z.string(), node_id: z.string() }),
  });

  private static readonly TRANSPORT_LINK_VALIDATOR = z.object({
    id: z.string(),
    name: z.string(),
    direction: z.string().optional(),
    destination: this.LINK_STATION_VALIDATOR.optional(),
    from: this.LINK_STATION_VALIDATOR.optional(),
    to: this.LINK_STATION_VALIDATOR.optional(),
    is_timetable: z.string().optional(),
    way: z.string().optional(),
  });

  private static readonly NAVITIME_TRANSPORT_VALIDATOR = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    type: z.string().optional(),
    color: z.string().optional(),
    company: z.object({ id: z.string(), name: z.string() }).optional(),
    fare: z.record(z.string(), z.number()).optional(),
    fare_break: z.record(z.string(), z.boolean()).optional(),
    fare_detail: this.FARE_DETAIL_VALIDATOR.array().optional(),
    fare_season: z.string().optional(),
    getoff: z.string().optional(),
    destination: z.object({ name: z.string() }).optional(),
    links: this.TRANSPORT_LINK_VALIDATOR.array().optional(),
  });

  private static readonly POINT_SECTION_VALIDATOR: z.ZodType<NavitimePointSection> = z.object({
    type: z.literal("point"),
    name: z.string().optional(),
    node_id: z.string().optional(),
    coord: NavitimeCommonValidator.COORD_VALIDATOR.optional(),
    gateway: z.string().optional(),
    node_types: z.string().array().optional(),
    numbering: z
      .object({
        departure: z.object({ symbol: z.string(), number: z.string() }).array().optional(),
        arrival: z.object({ symbol: z.string(), number: z.string() }).array().optional(),
      })
      .optional(),
  });

  private static readonly MOVE_SECTION_VALIDATOR: z.ZodType<NavitimeMoveSection> = z.object({
    type: z.literal("move"),
    move: z.string().optional(),
    line_name: z.string().optional(),
    distance: z.number().optional(),
    time: z.number().optional(),
    from_time: z.string().optional(),
    to_time: z.string().optional(),
    transport: this.NAVITIME_TRANSPORT_VALIDATOR.optional(),
  });

  private static readonly SECTION_VALIDATOR = z.discriminatedUnion("type", [
    this.POINT_SECTION_VALIDATOR as z.ZodObject<{ type: z.ZodLiteral<"point"> }>,
    this.MOVE_SECTION_VALIDATOR as z.ZodObject<{ type: z.ZodLiteral<"move"> }>,
  ]);

  private static readonly SUMMARY_ENDPOINT_VALIDATOR = z.object({
    type: z.literal("point"),
    name: z.string(),
    coord: NavitimeCommonValidator.COORD_VALIDATOR.optional(),
  });

  private static readonly SUMMARY_MOVE_VALIDATOR = z.object({
    time: z.number(),
    transit_count: z.number(),
    from_time: z.string(),
    to_time: z.string(),
    type: z.string().optional(),
    distance: z.number().optional(),
    walk_distance: z.number().optional(),
    fare: z.record(z.string(), z.number()).optional(),
    move_type: z.string().array().optional(),
    reference_fare: z
      .object({ lowest_total_ticket: z.number(), lowest_total_ic: z.number() })
      .optional(),
  });

  private static readonly ROUTE_ITEM_VALIDATOR = z.object({
    summary: z.object({
      no: z.string(),
      move: this.SUMMARY_MOVE_VALIDATOR,
      start: this.SUMMARY_ENDPOINT_VALIDATOR.optional(),
      goal: this.SUMMARY_ENDPOINT_VALIDATOR.optional(),
    }),
    sections: this.SECTION_VALIDATOR.array(),
  });

  private static readonly ROUTE_UNIT_VALIDATOR = z.object({
    coord_unit: z.string(),
    currency: z.string(),
    datum: z.string(),
    distance: z.string(),
    time: z.string(),
  });

  // ── Public validators ──────────────────────────────────────────────────────

  public static readonly REQUEST_VALIDATOR: z.ZodType<TransitSearchRequest> = z.object({
    from: z.string().regex(this.LAT_LNG_PATTERN, "must be 'lat,lng'"),
    to: z.string().regex(this.LAT_LNG_PATTERN, "must be 'lat,lng'"),
    datetime: z.iso.datetime({ local: true, offset: false }).optional(),
    lang: z.enum(NavitimeLang).optional(),
    order: z.enum(NavitimeSortOrder).optional(),
    limit: z.coerce.number().int().min(1).max(10).optional(),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<NavitimeTransitResponse> = z.object({
    items: this.ROUTE_ITEM_VALIDATOR.array(),
    unit: this.ROUTE_UNIT_VALIDATOR.optional(),
  });
}
