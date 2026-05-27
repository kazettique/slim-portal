import { PlaceDetails, PlaceItem, PlacePrediction } from "@slim-portal/share";
import { WorkerConstant } from "../constant";
import { Env } from "../type";
import { GMapPlace } from "../external/googleMap/places/type.common";
import { GMapSearchTextConstant } from "../external/googleMap/places/searchText/constant";
import { SearchTextRequest } from "../external/googleMap/places/searchText/type";
import { GMapSearchTextValidator } from "../external/googleMap/places/searchText/validator";
import { GMapAutocompleteConstant } from "../external/googleMap/places/autocomplete/constant";
import { AutocompleteRequest } from "../external/googleMap/places/autocomplete/type";
import { GMapAutocompleteValidator } from "../external/googleMap/places/autocomplete/validator";
import { GMapDetailsConstant } from "../external/googleMap/places/details/constant";
import { DetailsRequest } from "../external/googleMap/places/details/type";
import { GMapDetailsValidator } from "../external/googleMap/places/details/validator";
import { GMapSearchNearbyConstant } from "../external/googleMap/places/searchNearby/constant";
import { SearchNearbyRequest } from "../external/googleMap/places/searchNearby/type";
import { GMapSearchNearbyValidator } from "../external/googleMap/places/searchNearby/validator";

export abstract class PlacesLib {
  private static RAPIDAPI_HEADERS = (key: string, host: string): Record<string, string> => ({
    "x-rapidapi-key": key,
    "x-rapidapi-host": host,
    "Content-Type": "application/json",
    "X-Goog-FieldMask": "*",
  });

  // ── Helpers ──────────────────────────────────────────────────────────────────

  private static haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6_371_000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  private static mapPlaceToItem(p: GMapPlace, lat: number | null, lng: number | null): PlaceItem {
    return {
      id: p.id ?? null,
      name: p.displayName?.text ?? "",
      address: p.formattedAddress ?? "",
      rating: p.rating ?? null,
      totalRatings: p.userRatingCount ?? 0,
      distanceMeters:
        lat !== null && lng !== null && p.location?.latitude !== undefined && p.location?.longitude !== undefined
          ? this.haversineMeters(lat, lng, p.location.latitude, p.location.longitude)
          : null,
      mapsUrl: p.googleMapsUri ?? "",
      lat: p.location?.latitude ?? null,
      lng: p.location?.longitude ?? null,
    };
  }

  private static cacheKey(namespace: string, params: string): string {
    return `https://slim-portal-places-cache/${namespace}/${params}`;
  }

  // ── Public methods ────────────────────────────────────────────────────────────

  public static async search(
    req: SearchTextRequest,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<{ items: PlaceItem[]; cachedAt: string | null }> {
    const cache = await caches.open("places");
    const key = this.cacheKey("search", `${encodeURIComponent(req.q)}?lat=${req.lat ?? ""}&lng=${req.lng ?? ""}`);
    const cached = await cache.match(key);
    if (cached) {
      return { items: (await cached.json()) as PlaceItem[], cachedAt: cached.headers.get("X-Cached-At") };
    }

    const body: Record<string, unknown> = {
      textQuery: req.q,
      maxResultCount: GMapSearchTextConstant.MAX_RESULTS,
    };
    if (req.lat !== undefined && req.lng !== undefined) {
      body["locationBias"] = {
        circle: {
          center: { latitude: req.lat, longitude: req.lng },
          radius: GMapSearchTextConstant.SEARCH_RADIUS_METERS,
        },
      };
    }

    const res = await fetch(GMapSearchTextConstant.API_URL, {
      method: "POST",
      headers: this.RAPIDAPI_HEADERS(env.RAPIDAPI_KEY, GMapSearchTextConstant.API_HOST),
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Google Map searchText API error: ${res.status} — ${detail}`);
    }

    const raw = await res.json();
    const parsed = GMapSearchTextValidator.RESPONSE_VALIDATOR.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Google Map searchText response validation failed: ${parsed.error.message}`);
    }

    const lat = req.lat ?? null;
    const lng = req.lng ?? null;
    const items: PlaceItem[] = (parsed.data.places ?? []).map((p) => this.mapPlaceToItem(p, lat, lng));

    const cachedResponse = new Response(JSON.stringify(items), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${GMapSearchTextConstant.CACHE_TTL}`,
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { items, cachedAt: null };
  }

  public static async autocomplete(
    req: AutocompleteRequest,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<{ items: PlacePrediction[]; cachedAt: string | null }> {
    const cache = await caches.open("places");
    const key = this.cacheKey(
      "autocomplete",
      `${encodeURIComponent(req.input)}?lat=${req.lat ?? ""}&lng=${req.lng ?? ""}&radius=${req.radius ?? ""}`,
    );
    const cached = await cache.match(key);
    if (cached) {
      return { items: (await cached.json()) as PlacePrediction[], cachedAt: cached.headers.get("X-Cached-At") };
    }

    const body: Record<string, unknown> = { input: req.input };
    if (req.lat !== undefined && req.lng !== undefined) {
      body["locationBias"] = {
        circle: {
          center: { latitude: req.lat, longitude: req.lng },
          radius: req.radius ?? 10_000,
        },
      };
    }

    const res = await fetch(GMapAutocompleteConstant.API_URL, {
      method: "POST",
      headers: this.RAPIDAPI_HEADERS(env.RAPIDAPI_KEY, GMapAutocompleteConstant.API_HOST),
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Google Map autocomplete API error: ${res.status} — ${detail}`);
    }

    const raw = await res.json();
    const parsed = GMapAutocompleteValidator.RESPONSE_VALIDATOR.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Google Map autocomplete response validation failed: ${parsed.error.message}`);
    }

    const items: PlacePrediction[] = (parsed.data.suggestions ?? []).map((s) => {
      const pp = s.placePrediction;
      const qp = s.queryPrediction;
      return {
        placeId: pp?.placeId,
        text: pp?.text?.text ?? qp?.text?.text ?? "",
        mainText: pp?.structuredFormat?.mainText?.text ?? qp?.structuredFormat?.mainText?.text ?? "",
        secondaryText: pp?.structuredFormat?.secondaryText?.text ?? qp?.structuredFormat?.secondaryText?.text ?? "",
        distanceMeters: pp?.distanceMeters,
      };
    });

    const cachedResponse = new Response(JSON.stringify(items), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${GMapAutocompleteConstant.CACHE_TTL}`,
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { items, cachedAt: null };
  }

  public static async details(
    req: DetailsRequest,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<{ item: PlaceDetails; cachedAt: string | null }> {
    const cache = await caches.open("places");
    const key = this.cacheKey("details", encodeURIComponent(req.id));
    const cached = await cache.match(key);
    if (cached) {
      return { item: (await cached.json()) as PlaceDetails, cachedAt: cached.headers.get("X-Cached-At") };
    }

    const res = await fetch(`${GMapDetailsConstant.API_BASE_URL}/${encodeURIComponent(req.id)}`, {
      method: "GET",
      headers: this.RAPIDAPI_HEADERS(env.RAPIDAPI_KEY, GMapDetailsConstant.API_HOST),
      signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Google Map details API error: ${res.status} — ${detail}`);
    }

    const raw = await res.json();
    const parsed = GMapDetailsValidator.RESPONSE_VALIDATOR.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Google Map details response validation failed: ${parsed.error.message}`);
    }

    const p = parsed.data;
    const item: PlaceDetails = {
      id: p.id ?? null,
      name: p.displayName?.text ?? "",
      address: p.formattedAddress ?? "",
      rating: p.rating ?? null,
      totalRatings: p.userRatingCount ?? 0,
      distanceMeters: null,
      mapsUrl: p.googleMapsUri ?? "",
      lat: p.location?.latitude ?? null,
      lng: p.location?.longitude ?? null,
      phoneNumber: p.nationalPhoneNumber ?? null,
      website: p.websiteUri ?? null,
      openingHours: p.regularOpeningHours?.weekdayDescriptions ?? null,
      businessStatus: p.businessStatus ?? null,
    };

    const cachedResponse = new Response(JSON.stringify(item), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${GMapDetailsConstant.CACHE_TTL}`,
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { item, cachedAt: null };
  }

  public static async nearby(
    req: SearchNearbyRequest,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<{ items: PlaceItem[]; cachedAt: string | null }> {
    const cache = await caches.open("places");
    const key = this.cacheKey(
      "nearby",
      `lat=${req.lat}&lng=${req.lng}&radius=${req.radius ?? ""}&types=${(req.types ?? []).join(",")}`,
    );
    const cached = await cache.match(key);
    if (cached) {
      return { items: (await cached.json()) as PlaceItem[], cachedAt: cached.headers.get("X-Cached-At") };
    }

    const body: Record<string, unknown> = {
      maxResultCount: GMapSearchNearbyConstant.MAX_RESULTS,
      locationRestriction: {
        circle: {
          center: { latitude: req.lat, longitude: req.lng },
          radius: req.radius ?? 1_000,
        },
      },
    };
    if (req.types && req.types.length > 0) {
      body["includedTypes"] = req.types;
    }

    const res = await fetch(GMapSearchNearbyConstant.API_URL, {
      method: "POST",
      headers: this.RAPIDAPI_HEADERS(env.RAPIDAPI_KEY, GMapSearchNearbyConstant.API_HOST),
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Google Map searchNearby API error: ${res.status} — ${detail}`);
    }

    const raw = await res.json();
    const parsed = GMapSearchNearbyValidator.RESPONSE_VALIDATOR.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Google Map searchNearby response validation failed: ${parsed.error.message}`);
    }

    const items: PlaceItem[] = (parsed.data.places ?? []).map((p) => this.mapPlaceToItem(p, req.lat, req.lng));

    const cachedResponse = new Response(JSON.stringify(items), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${GMapSearchNearbyConstant.CACHE_TTL}`,
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { items, cachedAt: null };
  }
}
