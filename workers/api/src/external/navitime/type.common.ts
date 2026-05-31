export enum NavitimeLang {
  EN = "en",
  JA = "ja",
  KO = "ko",
  ZH_CN = "zh-CN",
  ZH_TW = "zh-TW",
}

export enum NavitimeSectionType {
  MOVE = "move",
  POINT = "point",
}

export enum NavitimeSortOrder {
  FARE = "fare",
  TIME = "time",
  TIME_OPTIMIZED = "time_optimized",
  TRANSFERS = "transfers",
}

export interface NavitimeCoord {
  lat: number;
  lon: number;
}
