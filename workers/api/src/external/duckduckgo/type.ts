import { DdgRelatedTopic, DdgResult } from "./type.common";

export interface DdgRequest {
  q: string;
}

export interface DdgResponse {
  Answer?: string;
  AbstractText?: string;
  AbstractURL?: string;
  AbstractSource?: string;
  Results?: DdgResult[];
  RelatedTopics?: DdgRelatedTopic[];
}
