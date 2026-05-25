import { z } from "zod/v4";
import { NavitimeCoord } from "./type.common";
import { NavitimeTransportCount, NavitimeTransportNode, NavitimeTransportUnit } from "./transport/type";

export abstract class NavitimeCommonValidator {
  public static readonly COORD_VALIDATOR: z.ZodType<NavitimeCoord> = z.object({
    lat: z.number(),
    lon: z.number(),
  });

  public static readonly TRANSPORT_COUNT_VALIDATOR: z.ZodType<NavitimeTransportCount> = z.object({
    total: z.number(),
    offset: z.number(),
    limit: z.number(),
  });

  public static readonly TRANSPORT_UNIT_VALIDATOR: z.ZodType<NavitimeTransportUnit> = z.object({
    datum: z.string(),
    coord_unit: z.string(),
    distance: z.string().optional(),
    time: z.string().optional(),
  });

  public static readonly TRANSPORT_NODE_VALIDATOR = z.object({
    id: z.string(),
    name: z.string(),
    ruby: z.string().optional(),
    types: z.string().array(),
    address_name: z.string().optional(),
    address_code: z.string().optional(),
    coord: this.COORD_VALIDATOR,
  });
}
