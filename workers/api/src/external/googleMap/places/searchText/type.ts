import type { GMapPlace } from "../type.common";

export interface SearchTextRequest {
  lat?: number;
  lng?: number;
  q: string;
}

export interface SearchTextResponse {
  places?: GMapPlace[];
}
