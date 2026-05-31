import { z } from "zod/v4";

import type { NavitimeTransportSearchRequest, NavitimeTransportSearchResponse } from "./type";

import { NavitimeLang } from "../../type.common";
import { NavitimeCommonValidator } from "../../validator.common";

export abstract class NavitimeTransportSearchValidator {
  public static readonly REQUEST_VALIDATOR: z.ZodType<NavitimeTransportSearchRequest> = z.object({
    coord_unit: z.string().optional(),
    datum: z.string().optional(),
    lang: z.enum(NavitimeLang).optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    word: z.string().min(1),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<NavitimeTransportSearchResponse> = z.object({
    count: NavitimeCommonValidator.TRANSPORT_COUNT_VALIDATOR,
    items: NavitimeCommonValidator.TRANSPORT_NODE_VALIDATOR.array(),
    unit: NavitimeCommonValidator.TRANSPORT_UNIT_VALIDATOR.optional(),
  });
}
