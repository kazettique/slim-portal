import { NewsItem } from "@slim-portal/share";
import { WorkerConstant } from "../constant";

export abstract class RssLib {
  private static stripCdata(s: string): string {
    return s.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, "$1").trim();
  }

  private static extractTag(block: string, tag: string): string {
    const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
    return m?.[1] ? this.stripCdata(m[1]).trim() : "";
  }

  private static extractLinkUrl(block: string): string {
    // <link> is often self-closed or has no end tag in RSS — match text node between tags
    const linked = block.match(/<link>([^<]+)<\/link>/i) ?? block.match(/<link\s*\/>([^<]*)/i);
    if (linked?.[1]?.trim()) return linked[1].trim();
    // Fall back to <guid> when it looks like a URL
    const guid = block.match(/<guid(?:[^>]*)>([^<]+)<\/guid>/i);
    const guidVal = guid?.[1]?.trim() ?? "";
    return guidVal.startsWith("http") ? guidVal : "";
  }

  private static parseRssXml(xml: string, source: string): NewsItem[] {
    const itemMatches = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
    console.log(`[rss] ${source}: found ${itemMatches.length} raw items`);
    return itemMatches
      .slice(0, 15)
      .map((block) => {
        const rawDesc = this.extractTag(block, "description");
        const summary = rawDesc.replace(/<[^>]*>/g, "").slice(0, 200);
        return {
          title: this.extractTag(block, "title"),
          summary,
          url: this.extractLinkUrl(block),
          publishedAt: this.extractTag(block, "pubDate"),
          source,
        };
      })
      .filter((item) => item.title && item.url);
  }

  private static async fetchFeed(
    feedUrl: string,
    source: string,
    cache: Cache,
    ctx: ExecutionContext,
  ): Promise<{ items: NewsItem[]; cachedAt: string | null }> {
    const cacheKey = new Request(feedUrl);

    const cached = await cache.match(cacheKey);
    if (cached) {
      const cachedAt = cached.headers.get("X-Cached-At");
      return { items: (await cached.json()) as NewsItem[], cachedAt };
    }

    const res = await fetch(feedUrl, {
      headers: { "User-Agent": "slim-portal/1.0 RSS reader" },
      signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
    });

    if (!res.ok) {
      throw new Error(`Feed fetch failed: ${feedUrl} → ${res.status}`);
    }

    const xml = await res.text();
    const items = this.parseRssXml(xml, source);

    const cacheResponse = new Response(JSON.stringify(items), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${WorkerConstant.CACHE_TTL}`,
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(cacheKey, cacheResponse));

    return { items, cachedAt: null };
  }

  public static async fetchAllFeeds(ctx: ExecutionContext): Promise<{ items: NewsItem[]; cachedAt: string | null }> {
    const cache = await caches.open("news-feeds");

    const results = await Promise.allSettled(
      WorkerConstant.FEEDS.map((feed) => this.fetchFeed(feed.url, feed.source, cache, ctx)),
    );

    const items: NewsItem[] = [];
    const cachedAts: string[] = [];
    let anyFresh = false;

    for (const [i, result] of results.entries()) {
      if (result.status === "fulfilled") {
        console.log(`[rss] ${WorkerConstant.FEEDS[i]?.source}: ${result.value.items.length} items`);
        items.push(...result.value.items);
        if (result.value.cachedAt !== null) {
          cachedAts.push(result.value.cachedAt);
        } else {
          anyFresh = true;
        }
      } else {
        console.error(`[rss] ${WorkerConstant.FEEDS[i]?.source} failed:`, result.reason);
        anyFresh = true;
      }
    }

    items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Only report a cache date when ALL feeds were served from cache
    const cachedAt =
      !anyFresh && cachedAts.length > 0
        ? cachedAts.reduce((earliest, ts) => (ts < earliest ? ts : earliest))
        : null;

    return { items: items.slice(0, 30), cachedAt };
  }
}
