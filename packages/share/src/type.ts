export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
}

export interface PlaceItem {
  name: string;
  address: string;
  rating: number | null;
  totalRatings: number;
  distanceMeters: number | null;
  mapsUrl: string;
  lat: number | null;
  lng: number | null;
}

export interface SearchItem {
  title: string;
  url: string;
  snippet: string;
}

export interface TransitLeg {
  line: string;
  from: string;
  to: string;
  depart: string | null;
  arrive: string | null;
  platform: string;
}

export interface TransitRoute {
  legs: TransitLeg[];
  totalTime: number;
  transfers: number;
  depart: string;
  arrive: string;
}
