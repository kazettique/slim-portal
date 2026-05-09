export type { NewsItem } from "@slim-portal/share";

export interface Env {
  ALLOWED_ORIGIN_DEV?: string;
  // Future:
  // NEWS_CACHE: KVNamespace;
  // GOOGLE_PLACES_API_KEY: string;
}

export interface Feed {
  url: string;
  source: string;
}
