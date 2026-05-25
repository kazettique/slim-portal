import { NavitimeLang } from "../../type.common";
import { NavitimeTransportNode, NavitimeTransportUnit } from "../type";

export interface NavitimeNodeNumbering {
  number: string;
  symbol: string;
}

export interface NavitimeAutocompleteNode extends NavitimeTransportNode {
  numbering?: NavitimeNodeNumbering[]; // flat array (unlike route section numbering)
}

export interface NavitimeAutocompleteRequest {
  word: string;
  word_match?: string; // "prefix" | "partial"
  coord?: string; // "lat,lng" — bias results toward this location
  radius?: number; // metres
  datum?: string;
  coord_unit?: string;
  lang?: NavitimeLang;
}

export interface NavitimeAutocompleteResponse {
  items: NavitimeAutocompleteNode[];
  unit?: NavitimeTransportUnit;
}
