export enum TimeFormat {
  TWELVE_HOUR = "12h",
  TWENTY_FOUR_HOUR = "24h",
}

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export enum NetworkPage {
  NEWS = "news",
  PLACES_SEARCH = "places/search",
  PLACES_NEARBY = "places/nearby",
  PLACES_DETAILS = "places/details",
  TRANSIT = "transit",
  SEARCH = "search",
  BATHROOMS = "bathrooms/nearby",
}

export interface NetworkEntry {
  page: NetworkPage;
  bytes: number;
  ts: string; // ISO 8601
}

export type GroupBy = "hour" | "day";
