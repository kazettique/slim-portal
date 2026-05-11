import { z } from "zod/v4";
import { GooglePlacesRequest, GooglePlacesResponse } from "./type";
import { GooglePlace, Latitude, Longitude } from "./type.common";

export abstract class PlacesValidator {
  private static readonly LATITUDE_VALIDATOR: z.ZodType<Latitude> = z.number().min(-90).max(90);
  private static readonly LONGITUDE_VALIDATOR: z.ZodType<Longitude> = z.number().min(-180).max(180);

  private static readonly GOOGLE_PLACE_VALIDATOR: z.ZodType<GooglePlace> = z.object({
    displayName: z
      .object({
        text: z.string().optional(),
      })
      .optional(),
    formattedAddress: z.string().optional(),
    rating: z.number().optional(),
    userRatingCount: z.number().int().nonnegative().optional(),
    location: z
      .object({
        latitude: this.LATITUDE_VALIDATOR.optional(),
        longitude: this.LONGITUDE_VALIDATOR.optional(),
      })
      .optional(),
    googleMapsUri: z.url().optional(),
  });

  public static readonly REQUEST_VALIDATOR: z.ZodType<GooglePlacesRequest> = z.object({
    q: z.string().min(1),
    lat: this.LATITUDE_VALIDATOR.optional(),
    lng: this.LONGITUDE_VALIDATOR.optional(),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<GooglePlacesResponse> = z.object({
    places: this.GOOGLE_PLACE_VALIDATOR.array(),
  });
}
