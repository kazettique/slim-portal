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
}
