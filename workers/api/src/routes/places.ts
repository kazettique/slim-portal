import { PlacesLib } from "../lib/places";
import { Env, HttpStatusCode } from "../type";
import { GMapSearchTextConstant } from "../external/googleMap/places/searchText/constant";
import { GMapSearchTextValidator } from "../external/googleMap/places/searchText/validator";
import { GMapAutocompleteConstant } from "../external/googleMap/places/autocomplete/constant";
import { GMapAutocompleteValidator } from "../external/googleMap/places/autocomplete/validator";
import { GMapDetailsConstant } from "../external/googleMap/places/details/constant";
import { GMapDetailsValidator } from "../external/googleMap/places/details/validator";
import { GMapSearchNearbyConstant } from "../external/googleMap/places/searchNearby/constant";
import { GMapSearchNearbyValidator } from "../external/googleMap/places/searchNearby/validator";

export async function handlePlacesSearch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const latRaw = url.searchParams.get("lat");
  const lngRaw = url.searchParams.get("lng");

  const result = GMapSearchTextValidator.REQUEST_VALIDATOR.safeParse({
    q: url.searchParams.get("q") ?? undefined,
    lat: latRaw !== null ? parseFloat(latRaw) : undefined,
    lng: lngRaw !== null ? parseFloat(lngRaw) : undefined,
  });
  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      status: HttpStatusCode.BAD_REQUEST,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { items, cachedAt } = await PlacesLib.search(result.data, env, ctx);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${GMapSearchTextConstant.CACHE_TTL}`,
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), { status: HttpStatusCode.OK, headers });
  } catch (err) {
    console.error("handlePlacesSearch error:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: "Failed to fetch places", detail }), {
      status: HttpStatusCode.BAD_GATEWAY,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function handlePlacesAutocomplete(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
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
      status: HttpStatusCode.BAD_REQUEST,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { items, cachedAt } = await PlacesLib.autocomplete(result.data, env, ctx);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${GMapAutocompleteConstant.CACHE_TTL}`,
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), { status: HttpStatusCode.OK, headers });
  } catch (err) {
    console.error("handlePlacesAutocomplete error:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: "Failed to fetch place predictions", detail }), {
      status: HttpStatusCode.BAD_GATEWAY,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function handlePlacesDetails(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);

  const result = GMapDetailsValidator.REQUEST_VALIDATOR.safeParse({
    id: url.searchParams.get("id") ?? undefined,
  });
  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      status: HttpStatusCode.BAD_REQUEST,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { item, cachedAt } = await PlacesLib.details(result.data, env, ctx);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${GMapDetailsConstant.CACHE_TTL}`,
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(item), { status: HttpStatusCode.OK, headers });
  } catch (err) {
    console.error("handlePlacesDetails error:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: "Failed to fetch place details", detail }), {
      status: HttpStatusCode.BAD_GATEWAY,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function handlePlacesNearby(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
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
      status: HttpStatusCode.BAD_REQUEST,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { items, cachedAt } = await PlacesLib.nearby(result.data, env, ctx);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${GMapSearchNearbyConstant.CACHE_TTL}`,
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), { status: HttpStatusCode.OK, headers });
  } catch (err) {
    console.error("handlePlacesNearby error:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: "Failed to fetch nearby places", detail }), {
      status: HttpStatusCode.BAD_GATEWAY,
      headers: { "Content-Type": "application/json" },
    });
  }
}
