import { z } from "zod/v4";
import { GMapLocText, GMapLocation, GMapOpeningHours, GMapPlace, Latitude, Longitude } from "./type.common";

export abstract class GMapCommonValidator {
  public static readonly LATITUDE_VALIDATOR: z.ZodType<Latitude> = z.number().min(-90).max(90);
  public static readonly LONGITUDE_VALIDATOR: z.ZodType<Longitude> = z.number().min(-180).max(180);

  public static readonly LOC_TEXT_VALIDATOR: z.ZodType<GMapLocText> = z.object({
    text: z.string().optional(),
    languageCode: z.string().optional(),
  });

  public static readonly LOCATION_VALIDATOR: z.ZodType<GMapLocation> = z.object({
    latitude: GMapCommonValidator.LATITUDE_VALIDATOR.optional(),
    longitude: GMapCommonValidator.LONGITUDE_VALIDATOR.optional(),
  });

  private static readonly OPENING_HOURS_VALIDATOR: z.ZodType<GMapOpeningHours> = z.object({
    weekdayDescriptions: z.string().array().optional(),
    openNow: z.boolean().optional(),
  });

  public static readonly PLACE_VALIDATOR: z.ZodType<GMapPlace> = z.object({
    id: z.string().optional(),
    displayName: GMapCommonValidator.LOC_TEXT_VALIDATOR.optional(),
    formattedAddress: z.string().optional(),
    shortFormattedAddress: z.string().optional(),
    location: GMapCommonValidator.LOCATION_VALIDATOR.optional(),
    rating: z.number().optional(),
    userRatingCount: z.number().int().nonnegative().optional(),
    googleMapsUri: z.string().optional(),
    nationalPhoneNumber: z.string().optional(),
    internationalPhoneNumber: z.string().optional(),
    websiteUri: z.string().optional(),
    businessStatus: z.string().optional(),
    regularOpeningHours: GMapCommonValidator.OPENING_HOURS_VALIDATOR.optional(),
    editorialSummary: GMapCommonValidator.LOC_TEXT_VALIDATOR.optional(),
  });
}
