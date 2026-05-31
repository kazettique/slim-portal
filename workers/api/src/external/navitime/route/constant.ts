export abstract class NavitimeRouteConstant {
  public static readonly API_HOST: string = "navitime-route-totalnavi.p.rapidapi.com";
  public static readonly API_URL: string =
    "https://navitime-route-totalnavi.p.rapidapi.com/route_transit";
  public static readonly CACHE_TTL: number = 3_600;
  public static readonly DEFAULT_LANG: string = "ja";
  public static readonly MAX_RESULTS: number = 5;
}
