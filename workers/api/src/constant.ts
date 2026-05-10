import { Feed } from "./type";

export abstract class WorkerConstant {
  public static readonly FEEDS: Feed[] = [
    { url: "https://www3.nhk.or.jp/rss/news/cat0.xml", source: "NHK" },
    { url: "https://feeds.bbci.co.uk/news/rss.xml", source: "BBC" },
  ];

  public static readonly CACHE_TTL: number = 15 * 60; // 15 minutes

  public static readonly PLACES_CACHE_TTL: number = 30 * 60; // 30 minutes
  public static readonly PLACES_MAX_RESULTS: number = 10;
  public static readonly PLACES_SEARCH_RADIUS_METERS: number = 50_000;

  public static readonly REQUEST_TIMEOUT: number = 6_000;

  public static readonly PLACES_API_URL = "https://places.googleapis.com/v1/places:searchText";
  public static readonly FIELD_MASK =
    "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.location,places.googleMapsUri";

  public static readonly SEARCH_CACHE_TTL: number = 60 * 60;
  public static readonly SEARCH_MAX_RESULTS: number = 10;
  public static readonly DUCKDUCKGO_API_URL: string = "https://api.duckduckgo.com/";
}
