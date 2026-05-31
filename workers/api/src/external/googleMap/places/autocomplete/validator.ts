import { z } from "zod/v4";

import type {
  AutocompletePlacePrediction,
  AutocompleteQueryPrediction,
  AutocompleteRequest,
  AutocompleteResponse,
  AutocompleteSuggestion,
} from "./type";

import { GMapCommonValidator } from "../validator.common";

export abstract class GMapAutocompleteValidator {
  public static readonly REQUEST_VALIDATOR: z.ZodType<AutocompleteRequest> = z.object({
    input: z.string().min(1),
    lat: GMapCommonValidator.LATITUDE_VALIDATOR.optional(),
    lng: GMapCommonValidator.LONGITUDE_VALIDATOR.optional(),
    radius: z.number().positive().optional(),
  });

  private static readonly TEXT_MATCH_VALIDATOR = z.object({
    endOffset: z.number().int().nonnegative().optional(),
    startOffset: z.number().int().nonnegative().optional(),
  });

  private static readonly AUTOCOMPLETE_TEXT_VALIDATOR = z.object({
    matches: GMapAutocompleteValidator.TEXT_MATCH_VALIDATOR.array().optional(),
    text: z.string().optional(),
  });

  private static readonly STRUCTURED_FORMAT_VALIDATOR = z.object({
    mainText: GMapAutocompleteValidator.AUTOCOMPLETE_TEXT_VALIDATOR.optional(),
    secondaryText: GMapAutocompleteValidator.AUTOCOMPLETE_TEXT_VALIDATOR.optional(),
  });

  private static readonly PLACE_PREDICTION_VALIDATOR: z.ZodType<AutocompletePlacePrediction> =
    z.object({
      distanceMeters: z.number().optional(),
      place: z.string().optional(),
      placeId: z.string().optional(),
      structuredFormat: GMapAutocompleteValidator.STRUCTURED_FORMAT_VALIDATOR.optional(),
      text: GMapAutocompleteValidator.AUTOCOMPLETE_TEXT_VALIDATOR.optional(),
      types: z.string().array().optional(),
    });

  private static readonly QUERY_PREDICTION_VALIDATOR: z.ZodType<AutocompleteQueryPrediction> =
    z.object({
      structuredFormat: GMapAutocompleteValidator.STRUCTURED_FORMAT_VALIDATOR.optional(),
      text: GMapAutocompleteValidator.AUTOCOMPLETE_TEXT_VALIDATOR.optional(),
    });

  private static readonly SUGGESTION_VALIDATOR: z.ZodType<AutocompleteSuggestion> = z.object({
    placePrediction: GMapAutocompleteValidator.PLACE_PREDICTION_VALIDATOR.optional(),
    queryPrediction: GMapAutocompleteValidator.QUERY_PREDICTION_VALIDATOR.optional(),
  });

  public static readonly RESPONSE_VALIDATOR: z.ZodType<AutocompleteResponse> = z.object({
    suggestions: GMapAutocompleteValidator.SUGGESTION_VALIDATOR.array().optional(),
  });
}
