import type { Env } from "../type";

import { PublicBathroomConstant } from "../external/publicBathroom/constant";
import { PublicBathroomValidator } from "../external/publicBathroom/validator";
import { BathroomLib } from "../lib/bathroom";
import { HttpStatusCode } from "../type";

export async function handleBathroomNearby(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
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
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  try {
    const { cachedAt, items } = await BathroomLib.nearby(result.data, env, ctx);
    const headers: Record<string, string> = {
      "Cache-Control": `public, max-age=${PublicBathroomConstant.CACHE_TTL}`,
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), { headers, status: HttpStatusCode.OK });
  } catch (err) {
    console.error("handleBathroomNearby error:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ detail, error: "Failed to fetch nearby bathrooms" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_GATEWAY,
    });
  }
}
