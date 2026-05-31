import type { DdgResult } from "./type.common";

export interface DdgRequest {
  q: string;
}

export interface DdgResponse {
  query: string;
  results: DdgResult[];
  status: string;
}
