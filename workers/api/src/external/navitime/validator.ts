import { z } from "zod/v4";
import { NavitimeLang, NavitimeSortOrder } from "./type.common";
import { TransitSearchRequest } from "./type";

export abstract class NavitimeValidator {
  private static readonly LAT_LNG_PATTERN: RegExp = /^-?\d{1,3}(\.\d+)?,-?\d{1,3}(\.\d+)?$/;

  public static readonly REQUEST_VALIDATOR: z.ZodType<TransitSearchRequest> = z.object({
    from: z.string().regex(this.LAT_LNG_PATTERN, "must be 'lat,lng'"),
    to: z.string().regex(this.LAT_LNG_PATTERN, "must be 'lat,lng'"),
    datetime: z.iso.datetime({ offset: false }).optional(),
    lang: z.enum(NavitimeLang).optional(),
    order: z.enum(NavitimeSortOrder).optional(),
    limit: z.coerce.number().int().min(1).max(10).optional(),
  });
}
