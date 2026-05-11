import { GooglePlace } from "./type.common";

export interface GooglePlacesRequest {
  q: string;
  lat?: number;
  lng?: number;
}

export interface GooglePlacesResponse {
  places?: GooglePlace[];
}
