import { GMapPlace } from "../type.common";

export interface SearchTextRequest {
  q: string;
  lat?: number;
  lng?: number;
}

export interface SearchTextResponse {
  places?: GMapPlace[];
}
