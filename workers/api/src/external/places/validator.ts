import { z } from "zod/v4";

export abstract class PlacesValidator {
  public static QUERY_VALIDATOR = z.object({
    q: z.string().min(1),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  });
}
