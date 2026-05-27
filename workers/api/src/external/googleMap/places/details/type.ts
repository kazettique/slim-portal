import { GMapPlace } from "../type.common";

export interface DetailsRequest {
  id: string;
}

// The details response is the full GMapPlace object
export type DetailsResponse = GMapPlace;
