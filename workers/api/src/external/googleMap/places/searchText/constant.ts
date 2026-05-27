export abstract class GMapSearchTextConstant {
  public static readonly API_URL: string =
    "https://google-map-places-new-v2.p.rapidapi.com/v1/places:searchText";
  public static readonly API_HOST: string = "google-map-places-new-v2.p.rapidapi.com";
  public static readonly CACHE_TTL: number = 1_800; // 30 minutes
  public static readonly MAX_RESULTS: number = 10;
  public static readonly SEARCH_RADIUS_METERS: number = 50_000;
}
