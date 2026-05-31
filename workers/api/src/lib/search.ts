import type { SearchItem } from "@slim-portal/share";

import type { DdgResponse } from "../external/duckduckgo/type";
import type { Env } from "../type";

import { WorkerConstant } from "../constant";
import { DuckDuckGoConstant } from "../external/duckduckgo/constant";

export abstract class SearchLib {
  public static async search(
    q: string,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<{ cachedAt: null | string; items: SearchItem[] }> {
    const cache = await caches.open("search");
    const key = this.cacheKey(q);
    const cached = await cache.match(key);
    if (cached) {
      const cachedAt = cached.headers.get("X-Cached-At");
      return { cachedAt, items: (await cached.json()) as SearchItem[] };
    }

    const apiUrl = new URL(DuckDuckGoConstant.API_URL);
    apiUrl.searchParams.set("q", q);

    const res = await fetch(apiUrl.toString(), {
      headers: {
        "x-rapidapi-host": DuckDuckGoConstant.API_HOST,
        "x-rapidapi-key": env.RAPIDAPI_KEY,
      },
      signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
    });

    if (!res.ok) throw new Error(`DuckDuckGo API error: ${res.status}`);

    const data = (await res.json()) as DdgResponse;
    const items = SearchLib.mapResults(data);

    const cachedResponse = new Response(JSON.stringify(items), {
      headers: {
        "Cache-Control": `public, max-age=${DuckDuckGoConstant.CACHE_TTL}`,
        "Content-Type": "application/json",
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { cachedAt: null, items };
  }

  private static cacheKey(q: string): string {
    return `https://slim-portal-search-cache/${encodeURIComponent(q)}`;
  }

  private static mapResults(data: DdgResponse): SearchItem[] {
    return data.results.slice(0, DuckDuckGoConstant.MAX_RESULTS).map((r) => ({
      snippet: r.description,
      title: r.title,
      url: r.url,
    }));
  }
}
