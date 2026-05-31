import { z } from "zod/v4";
import { NavitimeLang } from "../../type.common";
import { NavitimeCommonValidator } from "../../validator.common";
import { NavitimeAutocompleteRequest, NavitimeAutocompleteResponse } from "./type";

export abstract class NavitimeAutocompleteValidator {
  private static readonly LAT_LNG_PATTERN: RegExp = /^-?\d{1,3}(\.\d+)?,-?\d{1,3}(\.\d+)?$/;

  private static readonly NUMBERING_VALIDATOR = z.object({
    number: z.string(),
    symbol: z.string(),
  });

  private static readonly AUTOCOMPLETE_NODE_VALIDATOR =
    NavitimeCommonValidator.TRANSPORT_NODE_VALIDATOR.extend({
      numbering: this.NUMBERING_VALIDATOR.array().optional(),
    });

  public static readonly REQUEST_VALIDATOR: z.ZodType<NavitimeAutocompleteRequest> = z.object({
    word: z.string().min(2),
    word_match: z.string().optional(),
    coord: z.string().regex(this.LAT_LNG_PATTERN, "must be 'lat,lng'").optional(),
    radius: z.coerce.number().int().min(1).optional(),
    datum: z.string().optional(),
    coord_unit: z.string().optional(),
    lang: z.enum(NavitimeLang).optional(),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<NavitimeAutocompleteResponse> = z.object({
    items: this.AUTOCOMPLETE_NODE_VALIDATOR.array(),
    unit: NavitimeCommonValidator.TRANSPORT_UNIT_VALIDATOR.optional(),
  });
}
