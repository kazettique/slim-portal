import { PlaceItem } from "@slim-portal/share";
import { WorkerConstant } from "../constant";
import { Env, GooglePlacesResponse } from "../type";

export abstract class PlacesLib {
  private static cacheKey(q: string, lat: number | null, lng: number | null): string {
    return `https://slim-portal-places-cache/${encodeURIComponent(q)}?lat=${lat ?? ""}&lng=${lng ?? ""}`;
  }

  private static haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6_371_000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  public static async search(
    q: string,
    lat: number | null,
    lng: number | null,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<PlaceItem[]> {
    const cache = await caches.open("places");
    const key = this.cacheKey(q, lat, lng);
    const cached = await cache.match(key);
    if (cached) return (await cached.json()) as PlaceItem[];

    const body: Record<string, unknown> = {
      textQuery: q,
      maxResultCount: WorkerConstant.PLACES_MAX_RESULTS,
    };

    if (lat !== null && lng !== null) {
      body["locationBias"] = {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: WorkerConstant.PLACES_SEARCH_RADIUS_METERS,
        },
      };
    }

    const res = await fetch(WorkerConstant.PLACES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": WorkerConstant.FIELD_MASK,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
    });

    if (!res.ok) throw new Error(`Places API error: ${res.status}`);

    const data = (await res.json()) as GooglePlacesResponse;
    const places = data.places ?? [];

    const items: PlaceItem[] = places.map((p) => ({
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
    }));

    const cached_response = new Response(JSON.stringify(items), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${WorkerConstant.PLACES_CACHE_TTL}`,
      },
    });
    ctx.waitUntil(cache.put(key, cached_response));

    return items;
  }
}
