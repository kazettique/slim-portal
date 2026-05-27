import { z } from "zod/v4";
import { PublicBathroomApiItem, PublicBathroomRequest } from "./type";

export abstract class PublicBathroomValidator {
  private static readonly LATITUDE_VALIDATOR: z.ZodType<number> = z.number().min(-90).max(90);
  private static readonly LONGITUDE_VALIDATOR: z.ZodType<number> = z.number().min(-180).max(180);

  public static readonly REQUEST_VALIDATOR: z.ZodType<PublicBathroomRequest> = z.object({
    lat: PublicBathroomValidator.LATITUDE_VALIDATOR,
    lng: PublicBathroomValidator.LONGITUDE_VALIDATOR,
    radius: z.number().positive().optional(),
    page: z.number().int().positive().optional(),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<PublicBathroomApiItem[]> = z.array(
    z.object({
      id: z.number().int(),
      name: z.string(),
      city: z.string(),
      state: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      accessible: z.number().int(),
      changing_table: z.number().int(),
      unisex: z.number().int(),
      distance: z.number(),
    }),
  );
}
