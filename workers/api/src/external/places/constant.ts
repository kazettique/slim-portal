export abstract class PlacesConstant {
  public static readonly CACHE_TTL: number = 30 * 60; // 30 minutes
  public static readonly MAX_RESULTS: number = 10;
  public static readonly SEARCH_RADIUS_METERS: number = 50_000;
  public static readonly API_URL: string = "https://places.googleapis.com/v1/places:searchText";
  public static readonly FIELD_MASK: string =
    "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.location,places.googleMapsUri";
}
