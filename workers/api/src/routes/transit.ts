import { TransitLib } from "../lib/transit";
import { Env, HttpStatusCode } from "../type";
import { NavitimeRouteConstant } from "../external/navitime/route/constant";
import { NavitimeValidator } from "../external/navitime/route/validator";
import { NavitimeTransportConstant } from "../external/navitime/transport/constant";
import { NavitimeTransportSearchValidator } from "../external/navitime/transport/search/validator";
import { NavitimeTransportAroundValidator } from "../external/navitime/transport/around/validator";
import { NavitimeAutocompleteValidator } from "../external/navitime/transport/autocomplete/validator";

export async function handleTransit(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
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

export async function handleTransitSearch(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const result = NavitimeTransportSearchValidator.REQUEST_VALIDATOR.safeParse({
    word: url.searchParams.get("word") ?? undefined,
    offset: url.searchParams.get("offset") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
    lang: url.searchParams.get("lang") ?? undefined,
    datum: url.searchParams.get("datum") ?? undefined,
    coord_unit: url.searchParams.get("coord_unit") ?? undefined,
  });

  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      status: HttpStatusCode.BAD_REQUEST,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { result: searchResult, cachedAt } = await TransitLib.stationSearch(
      result.data,
      env,
      ctx,
    );
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${NavitimeTransportConstant.CACHE_TTL}`,
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(searchResult), { status: HttpStatusCode.OK, headers });
  } catch (err) {
    console.error("handleTransitSearch error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch transport nodes" }), {
      status: HttpStatusCode.BAD_GATEWAY,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function handleTransitAround(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const result = NavitimeTransportAroundValidator.REQUEST_VALIDATOR.safeParse({
    coord: url.searchParams.get("coord") ?? undefined,
    term: url.searchParams.get("term") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
    walk_speed: url.searchParams.get("walk_speed") ?? undefined,
    datum: url.searchParams.get("datum") ?? undefined,
    coord_unit: url.searchParams.get("coord_unit") ?? undefined,
    lang: url.searchParams.get("lang") ?? undefined,
  });

  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      status: HttpStatusCode.BAD_REQUEST,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { items, cachedAt } = await TransitLib.stationAround(result.data, env, ctx);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${NavitimeTransportConstant.CACHE_TTL}`,
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), { status: HttpStatusCode.OK, headers });
  } catch (err) {
    console.error("handleTransitAround error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch nearby transport nodes" }), {
      status: HttpStatusCode.BAD_GATEWAY,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function handleTransitAutocomplete(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const result = NavitimeAutocompleteValidator.REQUEST_VALIDATOR.safeParse({
    word: url.searchParams.get("word") ?? undefined,
    word_match: url.searchParams.get("word_match") ?? undefined,
    coord: url.searchParams.get("coord") ?? undefined,
    radius: url.searchParams.get("radius") ?? undefined,
    datum: url.searchParams.get("datum") ?? undefined,
    coord_unit: url.searchParams.get("coord_unit") ?? undefined,
    lang: url.searchParams.get("lang") ?? undefined,
  });

  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      status: HttpStatusCode.BAD_REQUEST,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { items, cachedAt } = await TransitLib.stationAutocomplete(result.data, env, ctx);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${NavitimeTransportConstant.CACHE_TTL}`,
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), { status: HttpStatusCode.OK, headers });
  } catch (err) {
    console.error("handleTransitAutocomplete error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch autocomplete suggestions" }), {
      status: HttpStatusCode.BAD_GATEWAY,
      headers: { "Content-Type": "application/json" },
    });
  }
}
