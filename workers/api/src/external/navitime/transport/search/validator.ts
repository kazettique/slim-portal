import { z } from "zod/v4";
import { NavitimeLang } from "../../type.common";
import { NavitimeCommonValidator } from "../../validator.common";
import { NavitimeTransportSearchRequest, NavitimeTransportSearchResponse } from "./type";

export abstract class NavitimeTransportSearchValidator {
  public static readonly REQUEST_VALIDATOR: z.ZodType<NavitimeTransportSearchRequest> = z.object({
    word: z.string().min(1),
    offset: z.coerce.number().int().min(0).optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
    lang: z.enum(NavitimeLang).optional(),
    datum: z.string().optional(),
    coord_unit: z.string().optional(),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<NavitimeTransportSearchResponse> =
    z.object({
      count: NavitimeCommonValidator.TRANSPORT_COUNT_VALIDATOR,
      items: NavitimeCommonValidator.TRANSPORT_NODE_VALIDATOR.array(),
      unit: NavitimeCommonValidator.TRANSPORT_UNIT_VALIDATOR.optional(),
    });
}
