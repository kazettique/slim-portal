import { SearchItem } from "@slim-portal/share";
import { WorkerConstant } from "../constant";
import { DuckDuckGoConstant } from "../external/duckduckgo/constant";
import { DdgResponse } from "../external/duckduckgo/type";
import { Env } from "../type";

export abstract class SearchLib {
  private static cacheKey(q: string): string {
    return `https://slim-portal-search-cache/${encodeURIComponent(q)}`;
  }

  private static mapResults(data: DdgResponse): SearchItem[] {
    return data.results.slice(0, DuckDuckGoConstant.MAX_RESULTS).map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.description,
    }));
  }

  public static async search(
    q: string,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<{ items: SearchItem[]; cachedAt: string | null }> {
    const cache = await caches.open("search");
    const key = this.cacheKey(q);
    const cached = await cache.match(key);
    if (cached) {
      const cachedAt = cached.headers.get("X-Cached-At");
      return { items: (await cached.json()) as SearchItem[], cachedAt };
    }

    const apiUrl = new URL(DuckDuckGoConstant.API_URL);
    apiUrl.searchParams.set("q", q);

    const res = await fetch(apiUrl.toString(), {
      headers: {
        "x-rapidapi-key": env.RAPIDAPI_KEY,
        "x-rapidapi-host": DuckDuckGoConstant.API_HOST,
      },
      signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
    });

    if (!res.ok) throw new Error(`DuckDuckGo API error: ${res.status}`);

    const data = (await res.json()) as DdgResponse;
    const items = SearchLib.mapResults(data);

    const cachedResponse = new Response(JSON.stringify(items), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${DuckDuckGoConstant.CACHE_TTL}`,
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { items, cachedAt: null };
  }
}
