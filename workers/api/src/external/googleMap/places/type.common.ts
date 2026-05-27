export type Latitude = number;
export type Longitude = number;

export interface GMapLocText {
  text?: string;
  languageCode?: string;
}

export interface GMapLocation {
  latitude?: number;
  longitude?: number;
}

export interface GMapOpeningHours {
  weekdayDescriptions?: string[];
  openNow?: boolean;
}

export interface GMapPlace {
  id?: string;
  displayName?: GMapLocText;
  formattedAddress?: string;
  shortFormattedAddress?: string;
  location?: GMapLocation;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  businessStatus?: string;
  regularOpeningHours?: GMapOpeningHours;
  editorialSummary?: GMapLocText;
}
