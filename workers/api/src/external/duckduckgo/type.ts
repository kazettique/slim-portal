export interface DdgResult {
  FirstURL: string;
  Text: string;
}

export interface DdgRelatedTopicLeaf {
  FirstURL: string;
  Text: string;
}

export interface DdgRelatedTopicGroup {
  Name: string;
  Topics: DdgRelatedTopicLeaf[];
}

export type DdgRelatedTopic = DdgRelatedTopicLeaf | DdgRelatedTopicGroup;

export interface DdgResponse {
  Answer?: string;
  AbstractText?: string;
  AbstractURL?: string;
  AbstractSource?: string;
  Results?: DdgResult[];
  RelatedTopics?: DdgRelatedTopic[];
}
