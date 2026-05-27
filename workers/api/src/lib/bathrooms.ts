import { BathroomItem } from "@slim-portal/share";
import { WorkerConstant } from "../constant";
import { Env } from "../type";
import { PublicBathroomConstant } from "../external/publicBathroom/constant";
import { PublicBathroomRequest } from "../external/publicBathroom/type";
import { PublicBathroomValidator } from "../external/publicBathroom/validator";

export abstract class BathroomsLib {
  private static readonly METERS_PER_MILE: number = 1_609.344;
  private static readonly MAX_RADIUS_MILES: number = 100;

  // The API may return a bare array or wrap it in an object — find the first array.
  private static extractArray(raw: unknown): unknown[] {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "object" && raw !== null) {
      for (const val of Object.values(raw)) {
        if (Array.isArray(val)) return val as unknown[];
      }
    }
    return [];
  }

  private static cacheKey(lat: number, lng: number, radiusMiles: number): string {
    return `https://slim-portal-bathrooms-cache/nearby/lat=${lat}&lng=${lng}&radius=${radiusMiles}`;
  }

  public static async nearby(
    req: PublicBathroomRequest,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<{ items: BathroomItem[]; cachedAt: string | null }> {
    const radiusMiles = Math.min((req.radius ?? 1_000) / this.METERS_PER_MILE, this.MAX_RADIUS_MILES);

    const cache = await caches.open("bathrooms");
    const key = this.cacheKey(req.lat, req.lng, radiusMiles);
    const cached = await cache.match(key);
    if (cached) {
      return { items: (await cached.json()) as BathroomItem[], cachedAt: cached.headers.get("X-Cached-At") };
    }

    const params = new URLSearchParams({
      lat: String(req.lat),
      lng: String(req.lng),
      radius: String(radiusMiles),
      page: String(req.page ?? 1),
      per_page: String(PublicBathroomConstant.PER_PAGE),
    });

    const res = await fetch(`${PublicBathroomConstant.API_URL}?${params}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": env.RAPIDAPI_KEY,
        "x-rapidapi-host": PublicBathroomConstant.API_HOST,
      },
      signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Public Bathrooms API error: ${res.status} — ${detail}`);
    }

    const raw = await res.json();
    const parsed = PublicBathroomValidator.RESPONSE_VALIDATOR.safeParse(this.extractArray(raw));
    if (!parsed.success) {
      throw new Error(`Public Bathrooms response validation failed: ${parsed.error.message}`);
    }

    const items: BathroomItem[] = parsed.data.map((b) => ({
      id: b.id,
      name: b.name,
      city: b.city,
      state: b.state,
      lat: b.latitude,
      lng: b.longitude,
      accessible: b.accessible !== 0,
      changingTable: b.changing_table !== 0,
      unisex: b.unisex !== 0,
      distanceKm: b.distance,
    }));

    const cachedResponse = new Response(JSON.stringify(items), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${PublicBathroomConstant.CACHE_TTL}`,
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { items, cachedAt: null };
  }
}
