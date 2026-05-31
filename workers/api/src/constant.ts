import type { Feed } from "./type";

export abstract class WorkerConstant {
  public static readonly CACHE_TTL: number = 15 * 60; // 15 minutes

  public static readonly FEEDS: Feed[] = [
    { source: "NHK", url: "https://www3.nhk.or.jp/rss/news/cat0.xml" },
    { source: "BBC", url: "https://feeds.bbci.co.uk/news/rss.xml" },
  ];

  public static readonly REQUEST_TIMEOUT: number = 6_000;
}
