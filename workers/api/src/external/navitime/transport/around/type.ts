import { NavitimeLang } from "../../type.common";
import { NavitimeTransportNode, NavitimeTransportUnit } from "../type";

export interface NavitimeAroundNode extends NavitimeTransportNode {
  distance: number; // metres
  time: number; // minutes walking
  gateway?: string;
}

export interface NavitimeTransportAroundRequest {
  coord: string; // "lat,lng"
  term?: number; // walk time limit (minutes)
  limit?: number;
  walk_speed?: number; // km/h
  datum?: string;
  coord_unit?: string;
  lang?: NavitimeLang;
}

export interface NavitimeTransportAroundResponse {
  items: NavitimeAroundNode[];
  unit?: NavitimeTransportUnit;
}
