import { z } from "zod/v4";
import { GMapCommonValidator } from "../validator.common";
import { DetailsRequest, DetailsResponse } from "./type";

export abstract class GMapDetailsValidator {
  public static readonly REQUEST_VALIDATOR: z.ZodType<DetailsRequest> = z.object({
    id: z.string().min(1),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<DetailsResponse> =
    GMapCommonValidator.PLACE_VALIDATOR;
}
