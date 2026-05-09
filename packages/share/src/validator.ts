import { z } from "zod/v4";
import { NewsItem } from "./type";

export abstract class ShareValidator {
  public static NEWS_ITEM_VALIDATOR: z.ZodType<NewsItem> = z.object({
    title: z.string(),
    summary: z.string(),
    url: z.url(),
    publishedAt: z.iso.date(),
    source: z.string(),
  });
}
