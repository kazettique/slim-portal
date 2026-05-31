import type { NavitimeLang } from "../../type.common";
import type { NavitimeTransportNode, NavitimeTransportUnit } from "../type";

export interface NavitimeAroundNode extends NavitimeTransportNode {
  distance: number; // metres
  gateway?: string;
  time: number; // minutes walking
}

export interface NavitimeTransportAroundRequest {
  coord: string; // "lat,lng"
  coord_unit?: string;
  datum?: string;
  lang?: NavitimeLang;
  limit?: number;
  term?: number; // walk time limit (minutes)
  walk_speed?: number; // km/h
}

export interface NavitimeTransportAroundResponse {
  items: NavitimeAroundNode[];
  unit?: NavitimeTransportUnit;
}
