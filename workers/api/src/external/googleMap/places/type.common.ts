export interface GMapLocation {
  latitude?: number;
  longitude?: number;
}
export interface GMapLocText {
  languageCode?: string;
  text?: string;
}

export interface GMapOpeningHours {
  openNow?: boolean;
  weekdayDescriptions?: string[];
}

export interface GMapPlace {
  businessStatus?: string;
  displayName?: GMapLocText;
  editorialSummary?: GMapLocText;
  formattedAddress?: string;
  googleMapsUri?: string;
  id?: string;
  internationalPhoneNumber?: string;
  location?: GMapLocation;
  nationalPhoneNumber?: string;
  rating?: number;
  regularOpeningHours?: GMapOpeningHours;
  shortFormattedAddress?: string;
  userRatingCount?: number;
  websiteUri?: string;
}

export type Latitude = number;

export type Longitude = number;
