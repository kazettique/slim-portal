import { SearchItem } from "@slim-portal/share";
import { WorkerConstant } from "../constant";
import { DdgRelatedTopic, DdgResponse } from "../type";

export abstract class SearchLib {
  private static cacheKey(q: string): string {
    return `https://slim-portal-search-cache/${encodeURIComponent(q)}`;
  }

  private static mapResults(data: DdgResponse): SearchItem[] {
    const items: SearchItem[] = [];

    if (data.Answer) {
      items.push({ title: data.Answer, url: data.AbstractURL ?? "", snippet: "" });
      return items;
    }

    if (data.AbstractText) {
      items.push({ title: data.AbstractSource ?? "Result", url: data.AbstractURL ?? "", snippet: data.AbstractText });
      return items;
    }

    for (const r of data.Results ?? []) {
      items.push({ title: r.Text, url: r.FirstURL, snippet: "" });
      if (items.length >= WorkerConstant.SEARCH_MAX_RESULTS) return items;
    }

    for (const topic of data.RelatedTopics ?? []) {
      SearchLib.collectLeafTopics(topic, items);
      if (items.length >= WorkerConstant.SEARCH_MAX_RESULTS) break;
    }

    return items.slice(0, WorkerConstant.SEARCH_MAX_RESULTS);
  }

  private static collectLeafTopics(topic: DdgRelatedTopic, out: SearchItem[]): void {
    if ("Topics" in topic) {
      for (const sub of topic.Topics) {
        out.push({ title: sub.Text, url: sub.FirstURL, snippet: "" });
        if (out.length >= WorkerConstant.SEARCH_MAX_RESULTS) return;
      }
    } else {
      out.push({ title: topic.Text, url: topic.FirstURL, snippet: "" });
    }
  }

  public static async search(q: string, ctx: ExecutionContext): Promise<{ items: SearchItem[]; cachedAt: string | null }> {
    const cache = await caches.open("search");
    const key = this.cacheKey(q);
    const cached = await cache.match(key);
    if (cached) {
      const cachedAt = cached.headers.get("X-Cached-At");
      return { items: (await cached.json()) as SearchItem[], cachedAt };
    }

    const apiUrl = new URL(WorkerConstant.DUCKDUCKGO_API_URL);
    apiUrl.searchParams.set("q", q);
    apiUrl.searchParams.set("format", "json");
    apiUrl.searchParams.set("no_html", "1");
    apiUrl.searchParams.set("skip_disambig", "1");

    const res = await fetch(apiUrl.toString(), {
      signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
    });

    if (!res.ok) throw new Error(`DuckDuckGo API error: ${res.status}`);

    const data = (await res.json()) as DdgResponse;
    const items = SearchLib.mapResults(data);

    const cachedResponse = new Response(JSON.stringify(items), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${WorkerConstant.SEARCH_CACHE_TTL}`,
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { items, cachedAt: null };
  }
}
