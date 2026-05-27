export interface PublicBathroomRequest {
  lat: number;
  lng: number;
  radius?: number; // meters — converted to km before calling the API
  page?: number;
}

// Raw API response item shape
export interface PublicBathroomApiItem {
  id: number;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  accessible: number; // 0 or 1
  changing_table: number; // 0 or 1
  unisex: number; // 0 or 1
  distance: number; // km
}
