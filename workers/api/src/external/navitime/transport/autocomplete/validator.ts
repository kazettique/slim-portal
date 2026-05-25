import { z } from "zod/v4";
import { NavitimeLang } from "../../type.common";
import { NavitimeAutocompleteRequest } from "./type";

export abstract class NavitimeAutocompleteValidator {
  private static readonly LAT_LNG_PATTERN: RegExp = /^-?\d{1,3}(\.\d+)?,-?\d{1,3}(\.\d+)?$/;

  public static readonly REQUEST_VALIDATOR: z.ZodType<NavitimeAutocompleteRequest> = z.object({
    word: z.string().min(1),
    word_match: z.string().optional(),
    coord: z.string().regex(this.LAT_LNG_PATTERN, "must be 'lat,lng'").optional(),
    radius: z.coerce.number().int().min(1).optional(),
    datum: z.string().optional(),
    coord_unit: z.string().optional(),
    lang: z.enum(NavitimeLang).optional(),
  });
}
