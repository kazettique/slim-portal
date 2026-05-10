export abstract class ShareConstant {
  public static readonly PAGE_URL_HOME: string = "/";
  public static readonly PAGE_URL_NEWS: string = "/news";
  public static readonly PAGE_URL_PLACES: string = "/places";
  public static readonly PAGE_URL_SEARCH: string = "/search";
  public static readonly PAGE_URLS: string[] = [
    this.PAGE_URL_HOME,
    this.PAGE_URL_NEWS,
    this.PAGE_URL_PLACES,
    this.PAGE_URL_SEARCH,
  ];
}
