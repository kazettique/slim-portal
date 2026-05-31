import type { NavitimeLang } from "../../type.common";
import type { NavitimeTransportCount, NavitimeTransportNode, NavitimeTransportUnit } from "../type";

export interface NavitimeTransportSearchRequest {
  coord_unit?: string;
  datum?: string;
  lang?: NavitimeLang;
  limit?: number;
  offset?: number;
  word: string;
}

export interface NavitimeTransportSearchResponse {
  count: NavitimeTransportCount;
  items: NavitimeTransportNode[];
  unit?: NavitimeTransportUnit;
}
