import { DdgResult } from "./type.common";

export interface DdgRequest {
  q: string;
}

export interface DdgResponse {
  status: string;
  query: string;
  results: DdgResult[];
}
