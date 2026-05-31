import { z } from "zod/v4";

import type { SearchTextRequest, SearchTextResponse } from "./type";

import { GMapCommonValidator } from "../validator.common";

export abstract class GMapSearchTextValidator {
  public static readonly REQUEST_VALIDATOR: z.ZodType<SearchTextRequest> = z.object({
    lat: GMapCommonValidator.LATITUDE_VALIDATOR.optional(),
    lng: GMapCommonValidator.LONGITUDE_VALIDATOR.optional(),
    q: z.string().min(1),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<SearchTextResponse> = z.object({
    places: GMapCommonValidator.PLACE_VALIDATOR.array().optional(),
  });
}
