import { Feed } from "./type";

export abstract class WorkerConstant {
  public static readonly FEEDS: Feed[] = [
    { url: "https://www3.nhk.or.jp/rss/news/cat0.xml", source: "NHK" },
    { url: "https://feeds.bbci.co.uk/news/rss.xml", source: "BBC" },
  ];

  public static readonly CACHE_TTL: number = 15 * 60; // 15 minutes
}
