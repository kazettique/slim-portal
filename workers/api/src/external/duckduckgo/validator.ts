import { z } from "zod/v4";

export abstract class DuckDuckGoValidator {
  public static QUERY_VALIDATOR = z.object({
    q: z.string().min(1),
  });
}
