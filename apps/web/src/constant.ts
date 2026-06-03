import { ShareConstant } from "@slim-portal/share";

import type { PageMeta } from "./type";

import pkg from "../package.json";

export abstract class AppConstant {
  public static readonly API_BASE_URL: string = "/api";
  public static readonly APP_DESCRIPTION: string =
    "Fast, minimal, text-first. Built for slow networks.";
  public static readonly APP_DESCRIPTION_FOOTER: string =
    "Slim Portal - optimized for slow networks";
  public static readonly APP_TITLE: string = "Slim Portal";
  public static readonly APP_VERSION: string = pkg.version;

  public static readonly DEFAULT_DESCRIPTION: string =
    "A lightweight web portal for slow networks.";
  public static readonly ICON_BOOKMARK: string = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
  public static readonly ICON_REFRESH: string = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>`;

  public static readonly MSG_BOOKMARK_SAVED: string = "Saved.";
  public static readonly MSG_CACHE_CLEAR_FAILED: string = "Failed to clear cache.";
  public static readonly MSG_CACHE_CLEARED: string = "Cache cleared.";
  public static readonly MSG_CONFIRM_DELETE_ALL_BOOKMARKS: string = "Delete all bookmarks?";
  public static readonly MSG_CONFIRM_DELETE_BOOKMARK: string = "Delete this bookmark?";
  public static readonly MSG_LOAD_BATHROOM_FAILED: string =
    "Could not load nearby bathrooms. Please try again.";
  public static readonly MSG_LOAD_NEWS_FAILED: string =
    "Could not load news. Please try again later.";
  public static readonly MSG_LOAD_PLACE_FAILED: string = "Could not load places. Please try again.";
  public static readonly MSG_LOAD_PLACE_FAILED_DETAIL: string =
    "Could not load place details. Please try again.";
  public static readonly MSG_LOAD_PLACE_FAILED_NEARBY: string =
    "Could not load nearby places. Please try again.";
  public static readonly MSG_NO_BOOKMARKS: string =
    "No saved bookmarks yet. Search for something and press Save.";
  public static readonly MSG_REFRESH_FAILED: string = "Refresh failed. Check your connection.";
  public static readonly MSG_SEARCH_FAILED: string = "Search failed. Please try again.";
  public static readonly MSG_SETTINGS_RESET: string = "Settings reset to defaults.";
  public static readonly MSG_TRANSIT_SEARCH_FAILED: string =
    "Could not find routes. Please try again.";

  public static readonly PAGE_META_BATHROOM: PageMeta = {
    description: "Find public bathrooms near your location.",
    icon: "🚻",
    title: "Bathrooms",
    url: ShareConstant.PAGE_URL_BATHROOM,
  };

  public static readonly PAGE_META_BOOKMARK: PageMeta = {
    description: "Your saved searches.",
    icon: "🔖",
    title: "Bookmarks",
    url: ShareConstant.PAGE_URL_BOOKMARK,
  };

  public static readonly PAGE_META_CONVERTER: PageMeta = {
    description: "Year and area unit converters for daily use.",
    icon: "🔁",
    title: "Convert",
    url: ShareConstant.PAGE_URL_CONVERTER,
  };

  public static readonly PAGE_META_HOME: PageMeta = {
    description: "A lightweight web portal for slow networks.",
    icon: "🏠",
    title: "Home",
    url: ShareConstant.PAGE_URL_HOME,
  };

  public static readonly PAGE_META_NEWS: PageMeta = {
    description: "Text-based news reader - top headlines from NHK and BBC.",
    icon: "📰",
    title: "News",
    url: ShareConstant.PAGE_URL_NEWS,
  };

  public static readonly PAGE_META_PLACE: PageMeta = {
    description: "Search nearby locations with ratings.",
    icon: "🗺️",
    title: "Places",
    url: ShareConstant.PAGE_URL_PLACE,
  };

  public static readonly PAGE_META_SEARCH: PageMeta = {
    description: "Text search powered by DuckDuckGo.",
    icon: "🔎",
    title: "Search",
    url: ShareConstant.PAGE_URL_SEARCH,
  };

  public static readonly PAGE_META_SETTINGS: PageMeta = {
    description: "Cache, time format, and network usage settings.",
    icon: "⚙️",
    title: "Settings",
    url: ShareConstant.PAGE_URL_SETTINGS,
  };

  public static readonly PAGE_META_TRANSIT: PageMeta = {
    description: "Find train and bus routes between stations.",
    icon: "🚃",
    title: "Transit",
    url: ShareConstant.PAGE_URL_TRANSIT,
  };

  public static readonly NAV_LIST: PageMeta[] = [
    this.PAGE_META_HOME,
    this.PAGE_META_BOOKMARK,
    this.PAGE_META_TRANSIT,
    this.PAGE_META_PLACE,
    this.PAGE_META_SEARCH,
    this.PAGE_META_NEWS,
    this.PAGE_META_BATHROOM,
    this.PAGE_META_CONVERTER,
    this.PAGE_META_SETTINGS,
  ];

  public static readonly PAGE_META_AREA_CONVERTER: PageMeta = {
    description: "Convert between 坪 (tsubo), ㎡ (square meters), and 畳 (tatami).",
    icon: "🍕",
    title: "Area Converter for Rental House",
    url: ShareConstant.PAGE_URL_AREA_CONVERTER,
  };

  public static readonly PAGE_META_NOT_FOUND: PageMeta = {
    description: "The page you requested doesn't exist.",
    icon: "🔍",
    title: "Page not found",
    url: "/",
  };

  public static readonly PAGE_META_OFFLINE: PageMeta = {
    description: "This page isn't saved for offline use.",
    icon: "📡",
    title: "You're offline",
    url: ShareConstant.PAGE_URL_OFFLINE,
  };

  public static readonly PAGE_META_PLACE_DETAIL: PageMeta = {
    description: "Detailed information about a place.",
    icon: "📋",
    title: "Place Details",
    url: ShareConstant.PAGE_URL_PLACE_DETAIL,
  };
  public static readonly PAGE_META_PLACE_NEARBY: PageMeta = {
    description: "Places near your current location.",
    icon: "🧭",
    title: "Nearby",
    url: ShareConstant.PAGE_URL_PLACE_NEARBY,
  };

  public static readonly PAGE_META_TRANSIT_DETAIL: PageMeta = {
    description: "Saved transit route.",
    icon: "🚃",
    title: "Route Details",
    url: ShareConstant.PAGE_URL_TRANSIT_DETAIL,
  };

  public static readonly PAGE_META_YEAR_CONVERTER: PageMeta = {
    description: "Convert between Western, ROC (Taiwan), and Japanese era years.",
    icon: "🗓️",
    title: "Year Converter",
    url: ShareConstant.PAGE_URL_YEAR_CONVERTER,
  };

  public static readonly REQUEST_TIMEOUT: number = 8_000;
  public static readonly WORKER_URL: string = import.meta.env.WORKER_URL ?? "";
  public static readonly MSG_CONFIRM_DELETE_SELECTED_BOOKMARKS: (n: number) => string = (n) =>
    `Delete ${n} selected bookmark${n > 1 ? "s" : ""}?`;
}
