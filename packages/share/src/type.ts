export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
}

export interface PlaceItem {
  id: string | null;
  name: string;
  address: string;
  rating: number | null;
  totalRatings: number;
  distanceMeters: number | null;
  mapsUrl: string;
  lat: number | null;
  lng: number | null;
}

export interface PlacePrediction {
  placeId?: string;
  text: string;
  mainText: string;
  secondaryText: string;
  distanceMeters?: number;
}

export interface PlaceDetails extends PlaceItem {
  phoneNumber: string | null;
  website: string | null;
  openingHours: string[] | null;
  businessStatus: string | null;
}

export interface SearchItem {
  title: string;
  url: string;
  snippet: string;
}

export interface TransportNode {
  id: string;
  name: string;
  ruby?: string;
  types: string[];
  coord: { lat: number; lng: number };
}

export interface TransportAroundNode extends TransportNode {
  distanceMeters: number;
  walkMinutes: number;
}

export interface TransportAutocompleteNode extends TransportNode {
  numbering?: Array<{ number: string; symbol: string }>;
}

export interface TransportSearchResult {
  total: number;
  offset: number;
  limit: number;
  items: TransportNode[];
}

export interface TransitLeg {
  line: string;
  from: string;
  to: string;
  depart: string | null;
  arrive: string | null;
  platform: string;
  color: string | null;
  getoff: string | null;
  distance: number | null;
  duration: number | null;
}

export interface TransitRoute {
  legs: TransitLeg[];
  totalTime: number;
  transfers: number;
  depart: string;
  arrive: string;
  referenceFare: { ticket: number; ic: number } | null;
}

export interface BathroomItem {
  id: number;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  accessible: boolean;
  changingTable: boolean;
  unisex: boolean;
  distanceKm: number;
}
