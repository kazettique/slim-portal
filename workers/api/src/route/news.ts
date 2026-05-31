import type { Env } from "../type";

import { RssLib } from "../lib/rss";
import { HttpStatusCode } from "../type";

export async function handleNews(
  _request: Request,
  _env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  try {
    const { cachedAt, items } = await RssLib.fetchAllFeeds(ctx);
    const headers: Record<string, string> = {
      "Cache-Control": "public, max-age=900",
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), {
      headers,
      status: HttpStatusCode.OK,
    });
  } catch (err) {
    console.error("handleNews error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch news" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_GATEWAY,
    });
  }
}
