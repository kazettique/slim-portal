import { z } from "zod/v4";

import type { DdgRequest, DdgResponse } from "./type";
import type { DdgResult, DdgSublink } from "./type.common";

export abstract class DuckDuckGoValidator {
  public static readonly REQUEST_VALIDATOR: z.ZodType<DdgRequest> = z.object({
    q: z.string().min(1),
  });

  private static readonly SUBLINK_VALIDATOR: z.ZodType<DdgSublink> = z.object({
    snippet: z.string(),
    targetUrl: z.string(),
    text: z.string(),
  });

  private static readonly RESULT_VALIDATOR: z.ZodType<DdgResult> = z.object({
    description: z.string(),
    description_html: z.string(),
    host: z.string(),
    position: z.number(),
    sublinks: z.array(this.SUBLINK_VALIDATOR),
    title: z.string(),
    types: z.string(),
    url: z.string(),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<DdgResponse> = z.object({
    query: z.string(),
    results: z.array(this.RESULT_VALIDATOR),
    status: z.string(),
  });
}
