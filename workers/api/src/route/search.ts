import type { Env } from "../type";

import { DuckDuckGoConstant } from "../external/duckduckgo/constant";
import { DuckDuckGoValidator } from "../external/duckduckgo/validator";
import { SearchLib } from "../lib/search";
import { HttpStatusCode } from "../type";

export async function handleSearch(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";

  const result = DuckDuckGoValidator.REQUEST_VALIDATOR.safeParse({ q });
  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  try {
    const { cachedAt, items } = await SearchLib.search(result.data.q, env, ctx);
    const headers: Record<string, string> = {
      "Cache-Control": `public, max-age=${DuckDuckGoConstant.CACHE_TTL}`,
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), {
      headers,
      status: HttpStatusCode.OK,
    });
  } catch (err) {
    console.error("handleSearch error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch search results" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_GATEWAY,
    });
  }
}
