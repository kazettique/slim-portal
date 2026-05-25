import { TransitLib } from "../lib/transit";
import { Env, HttpStatusCode } from "../type";
import { NavitimeRouteConstant } from "../external/navitime/route/constant";
import { NavitimeValidator } from "../external/navitime/route/validator";

export async function handleTransit(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const result = NavitimeValidator.REQUEST_VALIDATOR.safeParse({
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
    datetime: url.searchParams.get("datetime") ?? undefined,
    lang: url.searchParams.get("lang") ?? undefined,
    order: url.searchParams.get("order") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });

  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      status: HttpStatusCode.BAD_REQUEST,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { routes, cachedAt } = await TransitLib.search(
      result.data.from,
      result.data.to,
      result.data.datetime,
      env,
      ctx,
    );
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${NavitimeRouteConstant.CACHE_TTL}`,
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(routes), { status: HttpStatusCode.OK, headers });
  } catch (err) {
    console.error("handleTransit error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch transit routes" }), {
      status: HttpStatusCode.BAD_GATEWAY,
      headers: { "Content-Type": "application/json" },
    });
  }
}
