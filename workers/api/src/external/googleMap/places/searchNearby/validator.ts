import { z } from "zod/v4";

import type { SearchNearbyRequest, SearchNearbyResponse } from "./type";

import { GMapCommonValidator } from "../validator.common";

export abstract class GMapSearchNearbyValidator {
  public static readonly REQUEST_VALIDATOR: z.ZodType<SearchNearbyRequest> = z.object({
    lat: GMapCommonValidator.LATITUDE_VALIDATOR,
    lng: GMapCommonValidator.LONGITUDE_VALIDATOR,
    radius: z.number().positive().optional(),
    types: z.string().array().optional(),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<SearchNearbyResponse> = z.object({
    places: GMapCommonValidator.PLACE_VALIDATOR.array().optional(),
  });
}
