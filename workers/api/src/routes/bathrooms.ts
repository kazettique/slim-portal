import { BathroomsLib } from "../lib/bathrooms";
import { Env, HttpStatusCode } from "../type";
import { PublicBathroomConstant } from "../external/publicBathroom/constant";
import { PublicBathroomValidator } from "../external/publicBathroom/validator";

export async function handleBathroomsNearby(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const latRaw = url.searchParams.get("lat");
  const lngRaw = url.searchParams.get("lng");
  const radiusRaw = url.searchParams.get("radius");

  const result = PublicBathroomValidator.REQUEST_VALIDATOR.safeParse({
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
    const { items, cachedAt } = await BathroomsLib.nearby(result.data, env, ctx);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${PublicBathroomConstant.CACHE_TTL}`,
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), { status: HttpStatusCode.OK, headers });
  } catch (err) {
    console.error("handleBathroomsNearby error:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: "Failed to fetch nearby bathrooms", detail }), {
      status: HttpStatusCode.BAD_GATEWAY,
      headers: { "Content-Type": "application/json" },
    });
  }
}
