import { NavitimeCoord } from "../type.common";

export interface NavitimeTransportNode {
  id: string;
  name: string;
  ruby?: string;
  types: string[];
  address_name?: string;
  address_code?: string;
  coord: NavitimeCoord;
}

export interface NavitimeTransportCount {
  total: number;
  offset: number;
  limit: number;
}

export interface NavitimeTransportUnit {
  datum: string;
  coord_unit: string;
  distance?: string; // present in around response
  time?: string; // present in around response
}
