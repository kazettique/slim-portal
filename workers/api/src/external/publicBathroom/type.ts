// Raw API response item shape
export interface PublicBathroomApiItem {
  accessible: number; // 0 or 1
  changing_table: number; // 0 or 1
  city: string;
  distance: number; // km
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  state: string;
  unisex: number; // 0 or 1
}

export interface PublicBathroomRequest {
  lat: number;
  lng: number;
  page?: number;
  radius?: number; // meters — converted to km before calling the API
}
