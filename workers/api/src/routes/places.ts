import { PlacesLib } from "../lib/places";
import { Env, HttpStatusCode } from "../type";
import { WorkerValidator } from "../validator";
import { WorkerConstant } from "../constant";

export async function handlePlaces(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const latRaw = url.searchParams.get("lat");
  const lngRaw = url.searchParams.get("lng");
  const lat = latRaw !== null ? parseFloat(latRaw) : undefined;
  const lng = lngRaw !== null ? parseFloat(lngRaw) : undefined;

  const result = WorkerValidator.PLACES_QUERY_VALIDATOR.safeParse({ q, lat, lng });
  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      status: HttpStatusCode.BAD_REQUEST,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const items = await PlacesLib.search(
      result.data.q,
      result.data.lat ?? null,
      result.data.lng ?? null,
      env,
      ctx,
    );
    return new Response(JSON.stringify(items), {
      status: HttpStatusCode.OK,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${WorkerConstant.PLACES_CACHE_TTL}`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("handlePlaces error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch places" }), {
      status: HttpStatusCode.BAD_GATEWAY,
      headers: { "Content-Type": "application/json" },
    });
  }
}
