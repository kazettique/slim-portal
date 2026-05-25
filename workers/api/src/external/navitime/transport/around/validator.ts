import { z } from "zod/v4";
import { NavitimeLang } from "../../type.common";
import { NavitimeTransportAroundRequest } from "./type";

export abstract class NavitimeTransportAroundValidator {
  private static readonly LAT_LNG_PATTERN: RegExp = /^-?\d{1,3}(\.\d+)?,-?\d{1,3}(\.\d+)?$/;

  public static readonly REQUEST_VALIDATOR: z.ZodType<NavitimeTransportAroundRequest> = z.object({
    coord: z.string().regex(this.LAT_LNG_PATTERN, "must be 'lat,lng'"),
    term: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
    walk_speed: z.coerce.number().optional(),
    datum: z.string().optional(),
    coord_unit: z.string().optional(),
    lang: z.enum(NavitimeLang).optional(),
  });
}
