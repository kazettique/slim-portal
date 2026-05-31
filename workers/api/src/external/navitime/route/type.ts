import type { NavitimeCoord, NavitimeLang, NavitimeSortOrder } from "../type.common";

// ── Primitives ──────────────────────────────────────────────────────────────

export interface NavitimeFareDetail {
  fare: number;
  goal: { name: string; node_id: string };
  id: string;
  start: { name: string; node_id: string };
}

export interface NavitimeLinkStation {
  id: string;
  name: string;
}

// ── Transport ───────────────────────────────────────────────────────────────

export interface NavitimeMoveSection {
  distance?: number;
  from_time?: string;
  line_name?: string;
  move?: string; // "walk" | "local_train" | …
  time?: number;
  to_time?: string;
  transport?: NavitimeTransport;
  type: "move";
}

export interface NavitimePointSection {
  coord?: NavitimeCoord;
  gateway?: string;
  name?: string;
  node_id?: string;
  node_types?: string[];
  numbering?: {
    arrival?: Array<{ number: string; symbol: string }>;
    departure?: Array<{ number: string; symbol: string }>;
  };
  type: "point";
}

// ── Sections (discriminated union) ─────────────────────────────────────────

export interface NavitimeRouteItem {
  sections: NavitimeSection[];
  summary: {
    goal?: NavitimeSummaryEndpoint;
    move: NavitimeSummaryMove;
    no: string; // API returns string "1","2",… (was wrongly typed as number)
    start?: NavitimeSummaryEndpoint;
  };
}

export type NavitimeSection = NavitimeMoveSection | NavitimePointSection;

export interface NavitimeSummaryEndpoint {
  coord?: NavitimeCoord;
  name: string;
  type: "point";
}

// ── Summary ─────────────────────────────────────────────────────────────────

export interface NavitimeSummaryMove {
  distance?: number;
  fare?: Record<string, number>;
  from_time: string;
  move_type?: string[];
  reference_fare?: { lowest_total_ic: number; lowest_total_ticket: number };
  time: number;
  to_time: string;
  transit_count: number;
  type?: string;
  walk_distance?: number;
}

export interface NavitimeTransitRequest {
  goal: string;
  lang?: NavitimeLang;
  limit?: number;
  order?: NavitimeSortOrder;
  start: string;
  start_time: string;
}

// ── Route item ──────────────────────────────────────────────────────────────

export interface NavitimeTransitResponse {
  items: NavitimeRouteItem[];
  unit?: NavitimeUnit;
}

// ── Root response ────────────────────────────────────────────────────────────

export interface NavitimeTransport {
  color?: string;
  company?: { id: string; name: string };
  destination?: { name: string };
  fare?: Record<string, number>;
  fare_break?: Record<string, boolean>;
  fare_detail?: NavitimeFareDetail[];
  fare_season?: string;
  getoff?: string;
  id?: string;
  links?: NavitimeTransportLink[];
  name?: string;
  type?: string;
}

export interface NavitimeTransportLink {
  destination?: NavitimeLinkStation;
  direction?: string;
  from?: NavitimeLinkStation;
  id: string;
  is_timetable?: string; // "true" | "false" as string
  name: string;
  to?: NavitimeLinkStation;
  way?: string;
}

// ── Request types ────────────────────────────────────────────────────────────

export interface NavitimeUnit {
  coord_unit: string;
  currency: string;
  datum: string;
  distance: string;
  time: string;
}

export interface TransitSearchRequest {
  datetime?: string;
  from: string;
  lang?: NavitimeLang;
  limit?: number;
  order?: NavitimeSortOrder;
  to: string;
}
