import { z } from "zod/v4";

import type { NavitimeTransportAroundRequest, NavitimeTransportAroundResponse } from "./type";

import { NavitimeLang } from "../../type.common";
import { NavitimeCommonValidator } from "../../validator.common";

export abstract class NavitimeTransportAroundValidator {
  private static readonly LAT_LNG_PATTERN: RegExp = /^-?\d{1,3}(\.\d+)?,-?\d{1,3}(\.\d+)?$/;

  public static readonly REQUEST_VALIDATOR: z.ZodType<NavitimeTransportAroundRequest> = z.object({
    coord: z.string().regex(this.LAT_LNG_PATTERN, "must be 'lat,lng'"),
    coord_unit: z.string().optional(),
    datum: z.string().optional(),
    lang: z.enum(NavitimeLang).optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
    term: z.coerce.number().int().min(1).optional(),
    walk_speed: z.coerce.number().optional(),
  });

  private static readonly AROUND_NODE_VALIDATOR =
    NavitimeCommonValidator.TRANSPORT_NODE_VALIDATOR.extend({
      distance: z.number(),
      gateway: z.string().optional(),
      time: z.number(),
    });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<NavitimeTransportAroundResponse> = z.object({
    items: this.AROUND_NODE_VALIDATOR.array(),
    unit: NavitimeCommonValidator.TRANSPORT_UNIT_VALIDATOR.optional(),
  });
}
