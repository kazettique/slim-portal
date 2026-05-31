export interface BathroomItem {
  accessible: boolean;
  changingTable: boolean;
  city: string;
  distanceKm: number;
  id: number;
  lat: number;
  lng: number;
  name: string;
  state: string;
  unisex: boolean;
}

export interface NewsItem {
  publishedAt: string;
  source: string;
  summary: string;
  title: string;
  url: string;
}

export interface PlaceDetails extends PlaceItem {
  businessStatus: null | string;
  openingHours: null | string[];
  phoneNumber: null | string;
  website: null | string;
}

export interface PlaceItem {
  address: string;
  distanceMeters: null | number;
  id: null | string;
  lat: null | number;
  lng: null | number;
  mapsUrl: string;
  name: string;
  rating: null | number;
  totalRatings: number;
}

export interface PlacePrediction {
  distanceMeters?: number;
  mainText: string;
  placeId?: string;
  secondaryText: string;
  text: string;
}

export interface SearchItem {
  snippet: string;
  title: string;
  url: string;
}

export interface TransitLeg {
  arrive: null | string;
  color: null | string;
  depart: null | string;
  distance: null | number;
  duration: null | number;
  from: string;
  getoff: null | string;
  line: string;
  platform: string;
  to: string;
}

export interface TransitRoute {
  arrive: string;
  depart: string;
  legs: TransitLeg[];
  referenceFare: null | { ic: number; ticket: number };
  totalTime: number;
  transfers: number;
}

export interface TransportAroundNode extends TransportNode {
  distanceMeters: number;
  walkMinutes: number;
}

export interface TransportAutocompleteNode extends TransportNode {
  numbering?: Array<{ number: string; symbol: string }>;
}

export interface TransportNode {
  coord: { lat: number; lng: number };
  id: string;
  name: string;
  ruby?: string;
  types: string[];
}

export interface TransportSearchResult {
  items: TransportNode[];
  limit: number;
  offset: number;
  total: number;
}
