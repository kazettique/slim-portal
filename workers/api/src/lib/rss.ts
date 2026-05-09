import { NewsItem } from "@slim-portal/share";
import { WorkerConstant } from "../constant";

function stripCdata(s: string): string {
  return s.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, "$1").trim();
}

function extractTag(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m?.[1] ? stripCdata(m[1]).trim() : "";
}

function extractLinkUrl(block: string): string {
  // <link> is often self-closed or has no end tag in RSS — match text node between tags
  const linked = block.match(/<link>([^<]+)<\/link>/i) ?? block.match(/<link\s*\/>([^<]*)/i);
  if (linked?.[1]?.trim()) return linked[1].trim();
  // Fall back to <guid> when it looks like a URL
  const guid = block.match(/<guid(?:[^>]*)>([^<]+)<\/guid>/i);
  const guidVal = guid?.[1]?.trim() ?? "";
  return guidVal.startsWith("http") ? guidVal : "";
}

function parseRssXml(xml: string, source: string): NewsItem[] {
  const itemMatches = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  console.log(`[rss] ${source}: found ${itemMatches.length} raw items`);
  return itemMatches
    .slice(0, 15)
    .map((block) => {
      const rawDesc = extractTag(block, "description");
      const summary = rawDesc.replace(/<[^>]*>/g, "").slice(0, 200);
      return {
        title: extractTag(block, "title"),
        summary,
        url: extractLinkUrl(block),
        publishedAt: extractTag(block, "pubDate"),
        source,
      };
    })
    .filter((item) => item.title && item.url);
}

async function fetchFeed(feedUrl: string, source: string, cache: Cache, ctx: ExecutionContext): Promise<NewsItem[]> {
  const cacheKey = new Request(feedUrl);

  const cached = await cache.match(cacheKey);
  if (cached) {
    return (await cached.json()) as NewsItem[];
  }

  const res = await fetch(feedUrl, {
    headers: { "User-Agent": "slim-portal/1.0 RSS reader" },
    signal: AbortSignal.timeout(6000),
  });

  if (!res.ok) {
    throw new Error(`Feed fetch failed: ${feedUrl} → ${res.status}`);
  }

  const xml = await res.text();
  const items = parseRssXml(xml, source);

  const cacheResponse = new Response(JSON.stringify(items), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${WorkerConstant.CACHE_TTL}`,
    },
  });
  ctx.waitUntil(cache.put(cacheKey, cacheResponse));

  return items;
}

export async function fetchAllFeeds(ctx: ExecutionContext): Promise<NewsItem[]> {
  const cache = await caches.open("news-feeds");

  const results = await Promise.allSettled(
    WorkerConstant.FEEDS.map((feed) => fetchFeed(feed.url, feed.source, cache, ctx)),
  );

  const items: NewsItem[] = [];
  for (const [i, result] of results.entries()) {
    if (result.status === "fulfilled") {
      console.log(`[rss] ${WorkerConstant.FEEDS[i]?.source}: ${result.value.length} items`);
      items.push(...result.value);
    } else {
      console.error(`[rss] ${WorkerConstant.FEEDS[i]?.source} failed:`, result.reason);
    }
  }

  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return items.slice(0, 30);
}
