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
    title: "Home",
    description: "A lightweight web portal for slow networks.",
    url: ShareConstant.PAGE_URL_HOME,
  };

  public static readonly NEWS_PAGE_META: PageMeta = {
    title: "News",
    description: "Text-based news reader - top headlines from NHK and BBC.",
    url: ShareConstant.PAGE_URL_NEWS,
  };

  public static readonly PLACES_PAGE_META: PageMeta = {
    title: "Places",
    description: "Search nearby locations with ratings.",
    url: ShareConstant.PAGE_URL_PLACES,
  };

  public static readonly NAV_LIST: PageMeta[] = [this.HOME_PAGE_META, this.NEWS_PAGE_META, this.PLACES_PAGE_META];

  public static readonly FOOTER_MESSAGE: string = "Slim Portal - optimized for slow networks";

  public static readonly ERROR_MSG_LOAD_NEWS: string = "Could not load news. Please try again later.";
  public static readonly ERROR_MSG_LOAD_PLACES: string = "Could not load places. Please try again.";

  public static readonly ERROR_MSG_REFRESH_FAILED: string = "Refresh failed. Check your connection.";
}
