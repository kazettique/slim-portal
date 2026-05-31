import type { NavitimeCoord } from "../type.common";

export interface NavitimeTransportCount {
  limit: number;
  offset: number;
  total: number;
}

export interface NavitimeTransportNode {
  address_code?: string;
  address_name?: string;
  coord: NavitimeCoord;
  id: string;
  name: string;
  ruby?: string;
  types: string[];
}

export interface NavitimeTransportUnit {
  coord_unit: string;
  datum: string;
  distance?: string; // present in around response
  time?: string; // present in around response
}
