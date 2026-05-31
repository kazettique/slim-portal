export enum MenuPosition {
  BOTTOM = "bottom",
  TOP = "top",
}

export enum MenuStyle {
  BOTH = "both",
  ICON_ONLY = "icon-only",
  TEXT_ONLY = "text-only",
}

export enum NetworkPage {
  BATHROOM = "bathroom/nearby",
  NEWS = "news",
  PLACE_DETAIL = "place/detail",
  PLACE_NEARBY = "place/nearby",
  PLACE_SEARCH = "place/search",
  SEARCH = "search",
  TRANSIT = "transit",
}

export enum TextSize {
  EXTRA_LARGE = "extra-large",
  LARGE = "large",
  MEDIUM = "medium",
  SMALL = "small",
}

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
  SYSTEM = "system",
}

export enum TimeFormat {
  TWELVE_HOUR = "12h",
  TWENTY_FOUR_HOUR = "24h",
}

export type GroupBy = "day" | "hour";

export interface NetworkEntry {
  bytes: number;
  page: NetworkPage;
  ts: string; // ISO 8601
}
