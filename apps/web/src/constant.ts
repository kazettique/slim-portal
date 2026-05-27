import type { PageMeta } from "./type";
import { ShareConstant } from "@slim-portal/share";

export abstract class AppConstant {
  public static readonly APP_TITLE: string = "Slim Portal";
  public static readonly APP_DESCRIPTION: string = "Fast, minimal, text-first. Built for slow networks.";
  public static readonly WORKER_URL: string = import.meta.env.WORKER_URL ?? "";
  public static readonly API_BASE_URL: string = "/api";

  public static readonly DEFAULT_DESCRIPTION: string = "A lightweight web portal for slow networks.";

  public static readonly REQUEST_TIMEOUT: number = 8_000;

  public static readonly HOME_PAGE_META: PageMeta = {
    title: "🏠 Home",
    description: "A lightweight web portal for slow networks.",
    url: ShareConstant.PAGE_URL_HOME,
  };

  public static readonly NEWS_PAGE_META: PageMeta = {
    title: "📰 News",
    description: "Text-based news reader - top headlines from NHK and BBC.",
    url: ShareConstant.PAGE_URL_NEWS,
  };

  public static readonly PLACES_PAGE_META: PageMeta = {
    title: "🗺️ Places",
    description: "Search nearby locations with ratings.",
    url: ShareConstant.PAGE_URL_PLACES,
  };

  public static readonly PLACES_NEARBY_PAGE_META: PageMeta = {
    title: "🧭 Nearby",
    description: "Places near your current location.",
    url: ShareConstant.PAGE_URL_PLACES_NEARBY,
  };

  public static readonly PLACES_DETAILS_PAGE_META: PageMeta = {
    title: "📋 Place Details",
    description: "Detailed information about a place.",
    url: ShareConstant.PAGE_URL_PLACES_DETAILS,
  };

  public static readonly SEARCH_PAGE_META: PageMeta = {
    title: "🔎 Search",
    description: "Text search powered by DuckDuckGo.",
    url: ShareConstant.PAGE_URL_SEARCH,
  };

  public static readonly TRANSIT_PAGE_META: PageMeta = {
    title: "🚃 Transit",
    description: "Find train and bus routes between stations.",
    url: ShareConstant.PAGE_URL_TRANSIT,
  };

  public static readonly CONVERTER_PAGE_META: PageMeta = {
    title: "🔁 Convert",
    description: "Year and area unit converters for daily use.",
    url: ShareConstant.PAGE_URL_CONVERTER,
  };

  public static readonly SETTINGS_PAGE_META: PageMeta = {
    title: "⚙️ Settings",
    description: "Cache, time format, and network usage settings.",
    url: ShareConstant.PAGE_URL_SETTINGS,
  };

  public static readonly BATHROOMS_PAGE_META: PageMeta = {
    title: "🚻 Bathrooms",
    description: "Find public bathrooms near your location.",
    url: ShareConstant.PAGE_URL_BATHROOMS,
  };

  public static readonly YEAR_CONVERTER_PAGE_META: PageMeta = {
    title: "🗓️ 年份換算",
    description: "Convert between Western, ROC (Taiwan), and Japanese era years.",
    url: ShareConstant.PAGE_URL_YEAR_CONVERTER,
  };

  public static readonly AREA_CONVERTER_PAGE_META: PageMeta = {
    title: "🍕 面積換算",
    description: "Convert between 坪 (tsubo), ㎡ (square meters), and 畳 (tatami).",
    url: ShareConstant.PAGE_URL_AREA_CONVERTER,
  };

  public static readonly NAV_LIST: PageMeta[] = [
    this.HOME_PAGE_META,
    this.TRANSIT_PAGE_META,
    this.PLACES_PAGE_META,
    this.SEARCH_PAGE_META,
    this.NEWS_PAGE_META,
    this.BATHROOMS_PAGE_META,
    this.CONVERTER_PAGE_META,
    this.SETTINGS_PAGE_META,
  ];

  public static readonly FOOTER_MESSAGE: string = "Slim Portal - optimized for slow networks";

  public static readonly ERROR_MSG_LOAD_NEWS: string = "Could not load news. Please try again later.";
  public static readonly ERROR_MSG_LOAD_PLACES: string = "Could not load places. Please try again.";
  public static readonly ERROR_MSG_LOAD_PLACES_NEARBY: string = "Could not load nearby places. Please try again.";
  public static readonly ERROR_MSG_LOAD_PLACE_DETAILS: string = "Could not load place details. Please try again.";
  public static readonly ERROR_MSG_PLACES_AUTOCOMPLETE_FAILED: string = "Could not load suggestions.";
  public static readonly ERROR_MSG_SEARCH_FAILED: string = "Search failed. Please try again.";

  public static readonly ERROR_MSG_REFRESH_FAILED: string = "Refresh failed. Check your connection.";

  public static readonly MSG_CACHE_CLEARED: string = "Cache cleared.";
  public static readonly MSG_CACHE_CLEAR_FAILED: string = "Failed to clear cache.";
  public static readonly MSG_SETTINGS_RESET: string = "Settings reset to defaults.";

  public static readonly ERROR_MSG_LOAD_BATHROOMS: string = "Could not load nearby bathrooms. Please try again.";

  public static readonly ERROR_MSG_TRANSIT_SEARCH_FAILED: string = "Could not find routes. Please try again.";
  public static readonly ERROR_MSG_TRANSIT_AUTOCOMPLETE_FAILED: string = "Could not load suggestions.";

  public static readonly REFRESH_ICON: string = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>`;
}
