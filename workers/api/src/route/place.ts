import type { Env } from "../type";

import { GMapAutocompleteConstant } from "../external/googleMap/places/autocomplete/constant";
import { GMapAutocompleteValidator } from "../external/googleMap/places/autocomplete/validator";
import { GMapDetailsConstant } from "../external/googleMap/places/details/constant";
import { GMapDetailsValidator } from "../external/googleMap/places/details/validator";
import { GMapSearchNearbyConstant } from "../external/googleMap/places/searchNearby/constant";
import { GMapSearchNearbyValidator } from "../external/googleMap/places/searchNearby/validator";
import { GMapSearchTextConstant } from "../external/googleMap/places/searchText/constant";
import { GMapSearchTextValidator } from "../external/googleMap/places/searchText/validator";
import { PlaceLib } from "../lib/place";
import { HttpStatusCode } from "../type";

export async function handlePlaceAutocomplete(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const latRaw = url.searchParams.get("lat");
  const lngRaw = url.searchParams.get("lng");
  const radiusRaw = url.searchParams.get("radius");

  const result = GMapAutocompleteValidator.REQUEST_VALIDATOR.safeParse({
    input: url.searchParams.get("input") ?? undefined,
    lat: latRaw !== null ? parseFloat(latRaw) : undefined,
    lng: lngRaw !== null ? parseFloat(lngRaw) : undefined,
    radius: radiusRaw !== null ? parseFloat(radiusRaw) : undefined,
  });
  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  try {
    const { cachedAt, items } = await PlaceLib.autocomplete(result.data, env, ctx);
    const headers: Record<string, string> = {
      "Cache-Control": `public, max-age=${GMapAutocompleteConstant.CACHE_TTL}`,
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), { headers, status: HttpStatusCode.OK });
  } catch (err) {
    console.error("handlePlaceAutocomplete error:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ detail, error: "Failed to fetch place predictions" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_GATEWAY,
    });
  }
}

export async function handlePlaceDetail(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);

  const result = GMapDetailsValidator.REQUEST_VALIDATOR.safeParse({
    id: url.searchParams.get("id") ?? undefined,
  });
  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  try {
    const { cachedAt, item } = await PlaceLib.details(result.data, env, ctx);
    const headers: Record<string, string> = {
      "Cache-Control": `public, max-age=${GMapDetailsConstant.CACHE_TTL}`,
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(item), { headers, status: HttpStatusCode.OK });
  } catch (err) {
    console.error("handlePlaceDetail error:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ detail, error: "Failed to fetch place details" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_GATEWAY,
    });
  }
}

export async function handlePlaceNearby(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const latRaw = url.searchParams.get("lat");
  const lngRaw = url.searchParams.get("lng");
  const radiusRaw = url.searchParams.get("radius");
  const typesRaw = url.searchParams.get("types");

  const result = GMapSearchNearbyValidator.REQUEST_VALIDATOR.safeParse({
    lat: latRaw !== null ? parseFloat(latRaw) : undefined,
    lng: lngRaw !== null ? parseFloat(lngRaw) : undefined,
    radius: radiusRaw !== null ? parseFloat(radiusRaw) : undefined,
    types: typesRaw !== null ? typesRaw.split(",").filter(Boolean) : undefined,
  });
  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  try {
    const { cachedAt, items } = await PlaceLib.nearby(result.data, env, ctx);
    const headers: Record<string, string> = {
      "Cache-Control": `public, max-age=${GMapSearchNearbyConstant.CACHE_TTL}`,
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), { headers, status: HttpStatusCode.OK });
  } catch (err) {
    console.error("handlePlaceNearby error:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ detail, error: "Failed to fetch nearby places" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_GATEWAY,
    });
  }
}

export async function handlePlaceSearch(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const latRaw = url.searchParams.get("lat");
  const lngRaw = url.searchParams.get("lng");

  const result = GMapSearchTextValidator.REQUEST_VALIDATOR.safeParse({
    lat: latRaw !== null ? parseFloat(latRaw) : undefined,
    lng: lngRaw !== null ? parseFloat(lngRaw) : undefined,
    q: url.searchParams.get("q") ?? undefined,
  });
  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  try {
    const { cachedAt, items } = await PlaceLib.search(result.data, env, ctx);
    const headers: Record<string, string> = {
      "Cache-Control": `public, max-age=${GMapSearchTextConstant.CACHE_TTL}`,
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), { headers, status: HttpStatusCode.OK });
  } catch (err) {
    console.error("handlePlaceSearch error:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ detail, error: "Failed to fetch places" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_GATEWAY,
    });
  }
}
