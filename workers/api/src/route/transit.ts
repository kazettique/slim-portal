import type { Env } from "../type";

import { NavitimeRouteConstant } from "../external/navitime/route/constant";
import { NavitimeValidator } from "../external/navitime/route/validator";
import { NavitimeTransportAroundValidator } from "../external/navitime/transport/around/validator";
import { NavitimeAutocompleteValidator } from "../external/navitime/transport/autocomplete/validator";
import { NavitimeTransportConstant } from "../external/navitime/transport/constant";
import { NavitimeTransportSearchValidator } from "../external/navitime/transport/search/validator";
import { TransitLib } from "../lib/transit";
import { HttpStatusCode } from "../type";

export async function handleTransit(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const result = NavitimeValidator.REQUEST_VALIDATOR.safeParse({
    datetime: url.searchParams.get("datetime") ?? undefined,
    from: url.searchParams.get("from") ?? undefined,
    lang: url.searchParams.get("lang") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
    order: url.searchParams.get("order") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
  });

  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  try {
    const { cachedAt, routes } = await TransitLib.search(
      result.data.from,
      result.data.to,
      result.data.datetime,
      env,
      ctx,
    );
    const headers: Record<string, string> = {
      "Cache-Control": `public, max-age=${NavitimeRouteConstant.CACHE_TTL}`,
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(routes), { headers, status: HttpStatusCode.OK });
  } catch (err) {
    console.error("handleTransit error:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ detail, error: "Failed to fetch transit routes" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_GATEWAY,
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
    coord_unit: url.searchParams.get("coord_unit") ?? undefined,
    datum: url.searchParams.get("datum") ?? undefined,
    lang: url.searchParams.get("lang") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
    term: url.searchParams.get("term") ?? undefined,
    walk_speed: url.searchParams.get("walk_speed") ?? undefined,
  });

  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  try {
    const { cachedAt, items } = await TransitLib.stationAround(result.data, env, ctx);
    const headers: Record<string, string> = {
      "Cache-Control": `public, max-age=${NavitimeTransportConstant.CACHE_TTL}`,
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), { headers, status: HttpStatusCode.OK });
  } catch (err) {
    console.error("handleTransitAround error:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ detail, error: "Failed to fetch nearby transport nodes" }),
      {
        headers: { "Content-Type": "application/json" },
        status: HttpStatusCode.BAD_GATEWAY,
      },
    );
  }
}

export async function handleTransitAutocomplete(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const result = NavitimeAutocompleteValidator.REQUEST_VALIDATOR.safeParse({
    coord: url.searchParams.get("coord") ?? undefined,
    coord_unit: url.searchParams.get("coord_unit") ?? undefined,
    datum: url.searchParams.get("datum") ?? undefined,
    lang: url.searchParams.get("lang") ?? undefined,
    radius: url.searchParams.get("radius") ?? undefined,
    word: url.searchParams.get("word") ?? undefined,
    word_match: url.searchParams.get("word_match") ?? undefined,
  });

  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  try {
    const { cachedAt, items } = await TransitLib.stationAutocomplete(result.data, env, ctx);
    const headers: Record<string, string> = {
      "Cache-Control": `public, max-age=${NavitimeTransportConstant.CACHE_TTL}`,
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(items), { headers, status: HttpStatusCode.OK });
  } catch (err) {
    console.error("handleTransitAutocomplete error:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ detail, error: "Failed to fetch autocomplete suggestions" }),
      {
        headers: { "Content-Type": "application/json" },
        status: HttpStatusCode.BAD_GATEWAY,
      },
    );
  }
}

export async function handleTransitSearch(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const result = NavitimeTransportSearchValidator.REQUEST_VALIDATOR.safeParse({
    coord_unit: url.searchParams.get("coord_unit") ?? undefined,
    datum: url.searchParams.get("datum") ?? undefined,
    lang: url.searchParams.get("lang") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
    offset: url.searchParams.get("offset") ?? undefined,
    word: url.searchParams.get("word") ?? undefined,
  });

  if (!result.success) {
    return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  try {
    const { cachedAt, result: searchResult } = await TransitLib.stationSearch(
      result.data,
      env,
      ctx,
    );
    const headers: Record<string, string> = {
      "Cache-Control": `public, max-age=${NavitimeTransportConstant.CACHE_TTL}`,
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    };
    if (cachedAt !== null) headers["X-Cache-Date"] = cachedAt;
    return new Response(JSON.stringify(searchResult), { headers, status: HttpStatusCode.OK });
  } catch (err) {
    console.error("handleTransitSearch error:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ detail, error: "Failed to fetch transport nodes" }), {
      headers: { "Content-Type": "application/json" },
      status: HttpStatusCode.BAD_GATEWAY,
    });
  }
}
