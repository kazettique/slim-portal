import { z } from "zod/v4";

import type { Feed } from "./type";

export abstract class WorkerValidator {
  public static CACHE_TTL_VALIDATOR: z.ZodType<number> = z.number().int().nonnegative();

  public static FEED_VALIDATOR: z.ZodType<Feed> = z.object({
    source: z.string().min(1),
    url: z.url(),
  });
  public static REQUEST_TIMEOUT_VALIDATOR: z.ZodType<number> = z.number().int().nonnegative();
}
