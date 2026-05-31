import { z } from "zod/v4";

import type { NavitimeTransportCount, NavitimeTransportUnit } from "./transport/type";
import type { NavitimeCoord } from "./type.common";

export abstract class NavitimeCommonValidator {
  public static readonly COORD_VALIDATOR: z.ZodType<NavitimeCoord> = z.object({
    lat: z.number(),
    lon: z.number(),
  });

  public static readonly TRANSPORT_COUNT_VALIDATOR: z.ZodType<NavitimeTransportCount> = z.object({
    limit: z.number(),
    offset: z.number(),
    total: z.number(),
  });

  public static readonly TRANSPORT_NODE_VALIDATOR = z.object({
    address_code: z.string().optional(),
    address_name: z.string().optional(),
    coord: this.COORD_VALIDATOR,
    id: z.string(),
    name: z.string(),
    ruby: z.string().optional(),
    types: z.string().array(),
  });

  public static readonly TRANSPORT_UNIT_VALIDATOR: z.ZodType<NavitimeTransportUnit> = z.object({
    coord_unit: z.string(),
    datum: z.string(),
    distance: z.string().optional(),
    time: z.string().optional(),
  });
}
