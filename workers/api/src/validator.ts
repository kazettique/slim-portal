import { z } from "zod/v4";
import { Feed } from "./type";

export abstract class WorkerValidator {
  public static FEED_VALIDATOR: z.ZodType<Feed> = z.object({
    url: z.url(),
    source: z.string(),
  });
}
