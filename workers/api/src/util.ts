import { HttpRequestMethod } from "./type";

export abstract class WorkerUtil {
  public static corsHeaders(origin: string | null, allowedOriginDev: string): Record<string, string> {
    if (origin && allowedOriginDev && origin === allowedOriginDev) {
      return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": [HttpRequestMethod.GET, HttpRequestMethod.OPTIONS].join(", "),
        "Access-Control-Allow-Headers": "Content-Type",
      };
    }
    return {};
  }
}
