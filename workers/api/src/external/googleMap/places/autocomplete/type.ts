export interface AutocompleteRequest {
  input: string;
  lat?: number;
  lng?: number;
  radius?: number;
}

interface AutocompleteTextMatch {
  startOffset?: number;
  endOffset?: number;
}

interface AutocompleteText {
  text?: string;
  matches?: AutocompleteTextMatch[];
}

interface AutocompleteStructuredFormat {
  mainText?: AutocompleteText;
  secondaryText?: AutocompleteText;
}

export interface AutocompletePlacePrediction {
  place?: string;
  placeId?: string;
  text?: AutocompleteText;
  structuredFormat?: AutocompleteStructuredFormat;
  types?: string[];
  distanceMeters?: number;
}

export interface AutocompleteQueryPrediction {
  text?: AutocompleteText;
  structuredFormat?: AutocompleteStructuredFormat;
}

export interface AutocompleteSuggestion {
  placePrediction?: AutocompletePlacePrediction;
  queryPrediction?: AutocompleteQueryPrediction;
}

export interface AutocompleteResponse {
  suggestions?: AutocompleteSuggestion[];
}
