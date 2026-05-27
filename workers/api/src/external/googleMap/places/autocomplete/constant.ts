export abstract class GMapAutocompleteConstant {
  public static readonly API_URL: string =
    "https://google-map-places-new-v2.p.rapidapi.com/v1/places:autocomplete";
  public static readonly API_HOST: string = "google-map-places-new-v2.p.rapidapi.com";
  public static readonly CACHE_TTL: number = 300; // 5 minutes
}
