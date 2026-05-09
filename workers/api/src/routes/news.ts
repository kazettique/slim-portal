import { fetchAllFeeds } from "../lib/rss";
import { Env } from "../type";

export async function handleNews(_request: Request, _env: Env, ctx: ExecutionContext): Promise<Response> {
  try {
    const items = await fetchAllFeeds(ctx);
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=900",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("handleNews error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch news" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
