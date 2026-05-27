import { SearchLib } from "../lib/search";
import { Env, HttpStatusCode } from "../type";
import { DuckDuckGoConstant } from "../external/duckduckgo/constant";
import { DuckDuckGoValidator } from "../external/duckduckgo/validator";

export async function handleSearch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";

  const result = DuckDuckGoValidator.REQUEST_VALIDATOR.safeParse({ q });
  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      status: HttpStatusCode.BAD_REQUEST,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { items, cachedAt } = await SearchLib.search(result.data.q, env, ctx);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${DuckDuckGoConstant.CACHE_TTL}`,
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), {
      status: HttpStatusCode.OK,
      headers,
    });
  } catch (err) {
    console.error("handleSearch error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch search results" }), {
      status: HttpStatusCode.BAD_GATEWAY,
      headers: { "Content-Type": "application/json" },
    });
  }
}
