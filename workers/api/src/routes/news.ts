import { RssLib } from "../lib/rss";
import { Env, HttpStatusCode } from "../type";

export async function handleNews(_request: Request, _env: Env, ctx: ExecutionContext): Promise<Response> {
  try {
    const { items, cachedAt } = await RssLib.fetchAllFeeds(ctx);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=900",
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), {
      status: HttpStatusCode.OK,
      headers,
    });
  } catch (err) {
    console.error("handleNews error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch news" }), {
      status: HttpStatusCode.BAD_GATEWAY,
      headers: { "Content-Type": "application/json" },
    });
  }
}
