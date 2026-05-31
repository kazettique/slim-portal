export abstract class ShareConstant {
  public static readonly PAGE_URL_AREA_CONVERTER: string = "/converter/area-converter";
  public static readonly PAGE_URL_BATHROOM: string = "/bathroom";
  public static readonly PAGE_URL_BOOKMARK: string = "/bookmark";
  public static readonly PAGE_URL_CONVERTER: string = "/converter";
  public static readonly PAGE_URL_HOME: string = "/";
  public static readonly PAGE_URL_NEWS: string = "/news";
  public static readonly PAGE_URL_OFFLINE: string = "/offline";
  public static readonly PAGE_URL_PLACE: string = "/place";
  public static readonly PAGE_URL_PLACE_DETAIL: string = "/place/detail";
  public static readonly PAGE_URL_PLACE_NEARBY: string = "/place/nearby";
  public static readonly PAGE_URL_SEARCH: string = "/search";
  public static readonly PAGE_URL_SETTINGS: string = "/settings";
  public static readonly PAGE_URL_TRANSIT: string = "/transit";
  public static readonly PAGE_URL_TRANSIT_DETAIL: string = "/transit/detail";
  public static readonly PAGE_URL_YEAR_CONVERTER: string = "/converter/year-converter";
  public static readonly PAGE_URLS: string[] = [
    this.PAGE_URL_HOME,
    this.PAGE_URL_NEWS,
    this.PAGE_URL_PLACE,
    this.PAGE_URL_PLACE_DETAIL,
    this.PAGE_URL_SEARCH,
    this.PAGE_URL_TRANSIT,
    this.PAGE_URL_TRANSIT_DETAIL,
    this.PAGE_URL_CONVERTER,
    this.PAGE_URL_YEAR_CONVERTER,
    this.PAGE_URL_AREA_CONVERTER,
    this.PAGE_URL_SETTINGS,
    this.PAGE_URL_BATHROOM,
    this.PAGE_URL_BOOKMARK,
    this.PAGE_URL_OFFLINE,
  ];
}
