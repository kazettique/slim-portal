import type { NavitimeLang } from "../../type.common";
import type { NavitimeTransportNode, NavitimeTransportUnit } from "../type";

export interface NavitimeAutocompleteNode extends NavitimeTransportNode {
  numbering?: NavitimeNodeNumbering[]; // flat array (unlike route section numbering)
}

export interface NavitimeAutocompleteRequest {
  coord?: string; // "lat,lng" — bias results toward this location
  coord_unit?: string;
  datum?: string;
  lang?: NavitimeLang;
  radius?: number; // metres
  word: string;
  word_match?: string; // "prefix" | "partial"
}

export interface NavitimeAutocompleteResponse {
  items: NavitimeAutocompleteNode[];
  unit?: NavitimeTransportUnit;
}

export interface NavitimeNodeNumbering {
  number: string;
  symbol: string;
}
