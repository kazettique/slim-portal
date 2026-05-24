import { NavitimeLang, NavitimeSortOrder } from "./type.common";

// ── Primitives ──────────────────────────────────────────────────────────────

export interface NavitimeCoord {
  lat: number;
  lon: number;
}

export interface NavitimeLinkStation {
  id: string;
  name: string;
}

export interface NavitimeFareDetail {
  id: string;
  fare: number;
  start: { name: string; node_id: string };
  goal: { name: string; node_id: string };
}

// ── Transport ───────────────────────────────────────────────────────────────

export interface NavitimeTransportLink {
  id: string;
  name: string;
  direction?: string;
  destination?: NavitimeLinkStation;
  from?: NavitimeLinkStation;
  to?: NavitimeLinkStation;
  is_timetable?: string; // "true" | "false" as string
  way?: string;
}

export interface NavitimeTransport {
  id?: string;
  name?: string;
  type?: string;
  color?: string;
  company?: { id: string; name: string };
  fare?: Record<string, number>;
  fare_break?: Record<string, boolean>;
  fare_detail?: NavitimeFareDetail[];
  fare_season?: string;
  getoff?: string;
  destination?: { name: string };
  links?: NavitimeTransportLink[];
}

// ── Sections (discriminated union) ─────────────────────────────────────────

export interface NavitimePointSection {
  type: "point";
  name?: string;
  node_id?: string;
  coord?: NavitimeCoord;
  gateway?: string;
  node_types?: string[];
  numbering?: {
    departure?: Array<{ symbol: string; number: string }>;
    arrival?: Array<{ symbol: string; number: string }>;
  };
}

export interface NavitimeMoveSection {
  type: "move";
  move?: string; // "walk" | "local_train" | …
  line_name?: string;
  distance?: number;
  time?: number;
  from_time?: string;
  to_time?: string;
  transport?: NavitimeTransport;
}

export type NavitimeSection = NavitimePointSection | NavitimeMoveSection;

// ── Summary ─────────────────────────────────────────────────────────────────

export interface NavitimeSummaryEndpoint {
  type: "point";
  name: string;
  coord?: NavitimeCoord;
}

export interface NavitimeSummaryMove {
  time: number;
  transit_count: number;
  from_time: string;
  to_time: string;
  type?: string;
  distance?: number;
  walk_distance?: number;
  fare?: Record<string, number>;
  move_type?: string[];
  reference_fare?: { lowest_total_ticket: number; lowest_total_ic: number };
}

// ── Route item ──────────────────────────────────────────────────────────────

export interface NavitimeRouteItem {
  summary: {
    no: string; // API returns string "1","2",… (was wrongly typed as number)
    move: NavitimeSummaryMove;
    start?: NavitimeSummaryEndpoint;
    goal?: NavitimeSummaryEndpoint;
  };
  sections: NavitimeSection[];
}

// ── Root response ────────────────────────────────────────────────────────────

export interface NavitimeUnit {
  coord_unit: string;
  currency: string;
  datum: string;
  distance: string;
  time: string;
}

export interface NavitimeTransitResponse {
  items: NavitimeRouteItem[];
  unit?: NavitimeUnit;
}

// ── Request types ────────────────────────────────────────────────────────────

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
