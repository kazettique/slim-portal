import { NavitimeLang } from "../../type.common";
import { NavitimeTransportCount, NavitimeTransportNode, NavitimeTransportUnit } from "../type";

export interface NavitimeTransportSearchRequest {
  word: string;
  offset?: number;
  limit?: number;
  lang?: NavitimeLang;
  datum?: string;
  coord_unit?: string;
}

export interface NavitimeTransportSearchResponse {
  count: NavitimeTransportCount;
  items: NavitimeTransportNode[];
  unit?: NavitimeTransportUnit;
}
