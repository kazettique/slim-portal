export abstract class GMapSearchNearbyConstant {
  public static readonly API_URL: string =
    "https://google-map-places-new-v2.p.rapidapi.com/v1/places:searchNearby";
  public static readonly API_HOST: string = "google-map-places-new-v2.p.rapidapi.com";
  public static readonly CACHE_TTL: number = 1_800; // 30 minutes
  public static readonly MAX_RESULTS: number = 20;
}
