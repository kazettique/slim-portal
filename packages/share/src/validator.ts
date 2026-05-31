import { z } from "zod/v4";

import type { NewsItem, PlaceItem } from "./type";

export abstract class ShareValidator {
  public static NEWS_ITEM_VALIDATOR: z.ZodType<NewsItem> = z.object({
    publishedAt: z.iso.date(),
    source: z.string(),
    summary: z.string(),
    title: z.string(),
    url: z.url(),
  });

  public static PLACE_ITEM_VALIDATOR: z.ZodType<PlaceItem> = z.object({
    address: z.string(),
    distanceMeters: z.number().int().nonnegative().nullable(),
    id: z.string().nullable(),
    lat: z.number().nullable(),
    lng: z.number().nullable(),
    mapsUrl: z.string(),
    name: z.string(),
    rating: z.number().nullable(),
    totalRatings: z.number().int().nonnegative(),
  });
}
