import type { GMapPlace } from "../type.common";

export interface SearchNearbyRequest {
  lat: number;
  lng: number;
  radius?: number;
  types?: string[];
}

export interface SearchNearbyResponse {
  places?: GMapPlace[];
}
