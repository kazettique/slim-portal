import { z } from "zod/v4";
import { GMapCommonValidator } from "../validator.common";
import { SearchTextRequest, SearchTextResponse } from "./type";

export abstract class GMapSearchTextValidator {
  public static readonly REQUEST_VALIDATOR: z.ZodType<SearchTextRequest> = z.object({
    q: z.string().min(1),
    lat: GMapCommonValidator.LATITUDE_VALIDATOR.optional(),
    lng: GMapCommonValidator.LONGITUDE_VALIDATOR.optional(),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<SearchTextResponse> = z.object({
    places: GMapCommonValidator.PLACE_VALIDATOR.array().optional(),
  });
}
