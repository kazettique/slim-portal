import { PlacesLib } from "../lib/places";
import { Env, HttpStatusCode } from "../type";
import { PlacesConstant } from "../external/places/constant";
import { PlacesValidator } from "../external/places/validator";

export async function handlePlaces(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const latRaw = url.searchParams.get("lat");
  const lngRaw = url.searchParams.get("lng");
  const lat = latRaw !== null ? parseFloat(latRaw) : undefined;
  const lng = lngRaw !== null ? parseFloat(lngRaw) : undefined;

  const result = PlacesValidator.REQUEST_VALIDATOR.safeParse({ q, lat, lng });
  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      status: HttpStatusCode.BAD_REQUEST,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { items, cachedAt } = await PlacesLib.search(
      result.data.q,
      result.data.lat ?? null,
      result.data.lng ?? null,
      env,
      ctx,
    );
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${PlacesConstant.CACHE_TTL}`,
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), {
      status: HttpStatusCode.OK,
      headers,
    });
  } catch (err) {
    console.error("handlePlaces error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch places" }), {
      status: HttpStatusCode.BAD_GATEWAY,
      headers: { "Content-Type": "application/json" },
    });
  }
}
