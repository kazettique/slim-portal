export interface GooglePlace {
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  location?: { latitude?: number; longitude?: number };
  googleMapsUri?: string;
}

export interface GooglePlacesResponse {
  places?: GooglePlace[];
}
