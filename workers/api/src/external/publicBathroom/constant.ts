export abstract class PublicBathroomConstant {
  public static readonly API_URL: string = "https://public-bathrooms.p.rapidapi.com/api/getByCords";
  public static readonly API_HOST: string = "public-bathrooms.p.rapidapi.com";
  public static readonly CACHE_TTL: number = 1_800; // 30 minutes
  public static readonly PER_PAGE: number = 10;
}
