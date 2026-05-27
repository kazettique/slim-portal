import { z } from "zod/v4";
import type { NewsItem, PlaceItem } from "./type";

export abstract class ShareValidator {
  public static NEWS_ITEM_VALIDATOR: z.ZodType<NewsItem> = z.object({
    title: z.string(),
    summary: z.string(),
    url: z.url(),
    publishedAt: z.iso.date(),
    source: z.string(),
  });

  public static PLACE_ITEM_VALIDATOR: z.ZodType<PlaceItem> = z.object({
    id: z.string().nullable(),
    name: z.string(),
    address: z.string(),
    rating: z.number().nullable(),
    totalRatings: z.number().int().nonnegative(),
    distanceMeters: z.number().int().nonnegative().nullable(),
    mapsUrl: z.string(),
    lat: z.number().nullable(),
    lng: z.number().nullable(),
  });
}
