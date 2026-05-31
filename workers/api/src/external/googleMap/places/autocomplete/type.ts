export interface AutocompletePlacePrediction {
  distanceMeters?: number;
  place?: string;
  placeId?: string;
  structuredFormat?: AutocompleteStructuredFormat;
  text?: AutocompleteText;
  types?: string[];
}

export interface AutocompleteQueryPrediction {
  structuredFormat?: AutocompleteStructuredFormat;
  text?: AutocompleteText;
}

export interface AutocompleteRequest {
  input: string;
  lat?: number;
  lng?: number;
  radius?: number;
}

export interface AutocompleteResponse {
  suggestions?: AutocompleteSuggestion[];
}

export interface AutocompleteSuggestion {
  placePrediction?: AutocompletePlacePrediction;
  queryPrediction?: AutocompleteQueryPrediction;
}

interface AutocompleteStructuredFormat {
  mainText?: AutocompleteText;
  secondaryText?: AutocompleteText;
}

interface AutocompleteText {
  matches?: AutocompleteTextMatch[];
  text?: string;
}

interface AutocompleteTextMatch {
  endOffset?: number;
  startOffset?: number;
}
