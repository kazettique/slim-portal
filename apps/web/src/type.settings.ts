export enum TimeFormat {
  TWELVE_HOUR = "12h",
  TWENTY_FOUR_HOUR = "24h",
}

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export enum MenuStyle {
  ICON_ONLY = "icon-only",
  BOTH = "both",
  TEXT_ONLY = "text-only",
}

export enum MenuPosition {
  TOP = "top",
  BOTTOM = "bottom",
}

export enum TextSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  EXTRA_LARGE = "extra-large",
}

export enum NetworkPage {
  NEWS = "news",
  PLACE_SEARCH = "place/search",
  PLACE_NEARBY = "place/nearby",
  PLACE_DETAIL = "place/detail",
  TRANSIT = "transit",
  SEARCH = "search",
  BATHROOM = "bathroom/nearby",
}

export interface NetworkEntry {
  page: NetworkPage;
  bytes: number;
  ts: string; // ISO 8601
}

export type GroupBy = "hour" | "day";
