import { NavitimeLang, NavitimeSortOrder } from "./type.common";

export interface NavitimeTransitRequest {
  start: string;
  goal: string;
  start_time: string;
  limit?: number;
  lang?: NavitimeLang;
  order?: NavitimeSortOrder;
}

export interface TransitSearchRequest {
  from: string;
  to: string;
  datetime?: string;
  lang?: NavitimeLang;
  order?: NavitimeSortOrder;
  limit?: number;
}

export interface NavitimeTransportLink {
  from_time?: string;
  to_time?: string;
}

export interface NavitimeTransport {
  name?: string;
  destination?: { name: string };
  links?: NavitimeTransportLink[];
}

export interface NavitimeSection {
  type: "point" | "move";
  name?: string;
  node_id?: string;
  transport?: NavitimeTransport;
  line_name?: string;
}

export interface NavitimeSummaryMove {
  time: number;
  transit_count: number;
  from_time: string;
  to_time: string;
}

export interface NavitimeRouteItem {
  summary: {
    no: number;
    move: NavitimeSummaryMove;
  };
  sections: NavitimeSection[];
}

export interface NavitimeTransitResponse {
  items: NavitimeRouteItem[];
}
