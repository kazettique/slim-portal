import { z } from "zod/v4";
import { Feed } from "./type";

export abstract class WorkerValidator {
  public static FEED_VALIDATOR: z.ZodType<Feed> = z.object({
    url: z.url(),
    source: z.string().min(1),
  });

  public static CACHE_TTL_VALIDATOR: z.ZodType<number> = z.number().int().nonnegative();
  public static REQUEST_TIMEOUT_VALIDATOR: z.ZodType<number> = z.number().int().nonnegative();

}
