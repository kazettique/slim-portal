export abstract class NavitimeTransportConstant {
  public static readonly API_HOST: string = "navitime-transport.p.rapidapi.com";
  public static readonly API_ENDPOINT: string = "https://" + this.API_HOST;
  public static readonly CACHE_TTL: number = 86_400; // 24h — station data is stable infrastructure
}
