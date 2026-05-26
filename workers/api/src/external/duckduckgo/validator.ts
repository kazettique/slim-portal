import { z } from "zod/v4";
import { DdgRequest, DdgResponse } from "./type";
import { DdgResult, DdgSublink } from "./type.common";

export abstract class DuckDuckGoValidator {
  private static readonly SUBLINK_VALIDATOR: z.ZodType<DdgSublink> = z.object({
    snippet: z.string(),
    targetUrl: z.string(),
    text: z.string(),
  });

  private static readonly RESULT_VALIDATOR: z.ZodType<DdgResult> = z.object({
    position: z.number(),
    url: z.string(),
    title: z.string(),
    description: z.string(),
    description_html: z.string(),
    types: z.string(),
    host: z.string(),
    sublinks: z.array(this.SUBLINK_VALIDATOR),
  });

  public static readonly REQUEST_VALIDATOR: z.ZodType<DdgRequest> = z.object({
    q: z.string().min(1),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<DdgResponse> = z.object({
    status: z.string(),
    query: z.string(),
    results: z.array(this.RESULT_VALIDATOR),
  });
}
