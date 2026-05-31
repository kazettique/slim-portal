import { z } from "zod/v4";

import type { PublicBathroomApiItem, PublicBathroomRequest } from "./type";

export abstract class PublicBathroomValidator {
  private static readonly LATITUDE_VALIDATOR: z.ZodType<number> = z.number().min(-90).max(90);
  private static readonly LONGITUDE_VALIDATOR: z.ZodType<number> = z.number().min(-180).max(180);

  public static readonly REQUEST_VALIDATOR: z.ZodType<PublicBathroomRequest> = z.object({
    lat: PublicBathroomValidator.LATITUDE_VALIDATOR,
    lng: PublicBathroomValidator.LONGITUDE_VALIDATOR,
    page: z.number().int().positive().optional(),
    radius: z.number().positive().optional(),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<PublicBathroomApiItem[]> = z.array(
    z.object({
      accessible: z.number().int(),
      changing_table: z.number().int(),
      city: z.string(),
      distance: z.number(),
      id: z.number().int(),
      latitude: z.number(),
      longitude: z.number(),
      name: z.string(),
      state: z.string(),
      unisex: z.number().int(),
    }),
  );
}
