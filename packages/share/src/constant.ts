export abstract class ShareConstant {
  public static readonly PAGE_URL_HOME: string = "/";
  public static readonly PAGE_URL_NEWS: string = "/news";
  public static readonly PAGE_URL_PLACES: string = "/places";
  public static readonly PAGE_URL_PLACES_NEARBY: string = "/places/nearby";
  public static readonly PAGE_URL_PLACES_DETAILS: string = "/places/details";
  public static readonly PAGE_URL_SEARCH: string = "/search";
  public static readonly PAGE_URL_TRANSIT: string = "/transit";
  public static readonly PAGE_URL_CONVERTER: string = "/converter";
  public static readonly PAGE_URL_YEAR_CONVERTER: string = "/converter/year-converter";
  public static readonly PAGE_URL_AREA_CONVERTER: string = "/converter/area-converter";
  public static readonly PAGE_URL_SETTINGS: string = "/settings";
  public static readonly PAGE_URL_BATHROOMS: string = "/bathrooms";
  public static readonly PAGE_URLS: string[] = [
    this.PAGE_URL_HOME,
    this.PAGE_URL_NEWS,
    this.PAGE_URL_PLACES,
    this.PAGE_URL_SEARCH,
    this.PAGE_URL_TRANSIT,
    this.PAGE_URL_CONVERTER,
    this.PAGE_URL_YEAR_CONVERTER,
    this.PAGE_URL_AREA_CONVERTER,
    this.PAGE_URL_SETTINGS,
    this.PAGE_URL_BATHROOMS,
  ];
}
