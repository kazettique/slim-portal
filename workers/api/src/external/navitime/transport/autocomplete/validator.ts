import { z } from "zod/v4";

import type { NavitimeAutocompleteRequest, NavitimeAutocompleteResponse } from "./type";

import { NavitimeLang } from "../../type.common";
import { NavitimeCommonValidator } from "../../validator.common";

export abstract class NavitimeAutocompleteValidator {
  private static readonly LAT_LNG_PATTERN: RegExp = /^-?\d{1,3}(\.\d+)?,-?\d{1,3}(\.\d+)?$/;

  public static readonly REQUEST_VALIDATOR: z.ZodType<NavitimeAutocompleteRequest> = z.object({
    coord: z.string().regex(this.LAT_LNG_PATTERN, "must be 'lat,lng'").optional(),
    coord_unit: z.string().optional(),
    datum: z.string().optional(),
    lang: z.enum(NavitimeLang).optional(),
    radius: z.coerce.number().int().min(1).optional(),
    word: z.string().min(2),
    word_match: z.string().optional(),
  });

  private static readonly NUMBERING_VALIDATOR = z.object({
    number: z.string(),
    symbol: z.string(),
  });

  private static readonly AUTOCOMPLETE_NODE_VALIDATOR =
    NavitimeCommonValidator.TRANSPORT_NODE_VALIDATOR.extend({
      numbering: this.NUMBERING_VALIDATOR.array().optional(),
    });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<NavitimeAutocompleteResponse> = z.object({
    items: this.AUTOCOMPLETE_NODE_VALIDATOR.array(),
    unit: NavitimeCommonValidator.TRANSPORT_UNIT_VALIDATOR.optional(),
  });
}
