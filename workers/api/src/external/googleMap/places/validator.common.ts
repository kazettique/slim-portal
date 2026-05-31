import { z } from "zod/v4";

import type {
  GMapLocation,
  GMapLocText,
  GMapOpeningHours,
  GMapPlace,
  Latitude,
  Longitude,
} from "./type.common";

export abstract class GMapCommonValidator {
  public static readonly LATITUDE_VALIDATOR: z.ZodType<Latitude> = z.number().min(-90).max(90);
  public static readonly LOC_TEXT_VALIDATOR: z.ZodType<GMapLocText> = z.object({
    languageCode: z.string().optional(),
    text: z.string().optional(),
  });

  public static readonly LONGITUDE_VALIDATOR: z.ZodType<Longitude> = z.number().min(-180).max(180);

  public static readonly LOCATION_VALIDATOR: z.ZodType<GMapLocation> = z.object({
    latitude: GMapCommonValidator.LATITUDE_VALIDATOR.optional(),
    longitude: GMapCommonValidator.LONGITUDE_VALIDATOR.optional(),
  });

  private static readonly OPENING_HOURS_VALIDATOR: z.ZodType<GMapOpeningHours> = z.object({
    openNow: z.boolean().optional(),
    weekdayDescriptions: z.string().array().optional(),
  });

  public static readonly PLACE_VALIDATOR: z.ZodType<GMapPlace> = z.object({
    businessStatus: z.string().optional(),
    displayName: GMapCommonValidator.LOC_TEXT_VALIDATOR.optional(),
    editorialSummary: GMapCommonValidator.LOC_TEXT_VALIDATOR.optional(),
    formattedAddress: z.string().optional(),
    googleMapsUri: z.string().optional(),
    id: z.string().optional(),
    internationalPhoneNumber: z.string().optional(),
    location: GMapCommonValidator.LOCATION_VALIDATOR.optional(),
    nationalPhoneNumber: z.string().optional(),
    rating: z.number().optional(),
    regularOpeningHours: GMapCommonValidator.OPENING_HOURS_VALIDATOR.optional(),
    shortFormattedAddress: z.string().optional(),
    userRatingCount: z.number().int().nonnegative().optional(),
    websiteUri: z.string().optional(),
  });
}
