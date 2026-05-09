import { z } from "zod/v4";
import type { PageMeta } from "./type";

export abstract class AppValidator {
  public static readonly WEB_TIMEOUT_VALIDATOR: z.ZodType<number> = z.number().int().nonnegative();

  public static readonly PAGE_META_VALIDATOR: z.ZodType<PageMeta> = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    url: z.string().min(1).startsWith("/"),
  });
}
