import type {
  TransitRoute,
  TransportAroundNode,
  TransportAutocompleteNode,
  TransportNode,
  TransportSearchResult,
} from "@slim-portal/share";

import type {
  NavitimeMoveSection,
  NavitimePointSection,
  NavitimeSection,
} from "../external/navitime/route/type";
import type { NavitimeTransportAroundRequest } from "../external/navitime/transport/around/type";
import type { NavitimeAutocompleteRequest } from "../external/navitime/transport/autocomplete/type";
import type { NavitimeTransportSearchRequest } from "../external/navitime/transport/search/type";
import type { NavitimeTransportNode } from "../external/navitime/transport/type";
import type { Env } from "../type";

import { WorkerConstant } from "../constant";
import { NavitimeRouteConstant } from "../external/navitime/route/constant";
import { NavitimeValidator } from "../external/navitime/route/validator";
import { NavitimeTransportAroundValidator } from "../external/navitime/transport/around/validator";
import { NavitimeAutocompleteValidator } from "../external/navitime/transport/autocomplete/validator";
import { NavitimeTransportConstant } from "../external/navitime/transport/constant";
import { NavitimeTransportSearchValidator } from "../external/navitime/transport/search/validator";

export abstract class TransitLib {
  // ── Route helpers ────────────────────────────────────────────────────────────

  public static async search(
    from: string,
    to: string,
    datetime: string | undefined,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<{ cachedAt: null | string; routes: TransitRoute[] }> {
    const startTime = datetime ?? this.toJSTString(new Date());

    const cache = await caches.open("transit");
    const key = this.cacheKey(from, to, startTime);
    const cached = await cache.match(key);
    if (cached) {
      const cachedAt = cached.headers.get("X-Cached-At");
      return { cachedAt, routes: (await cached.json()) as TransitRoute[] };
    }

    const params = new URLSearchParams({
      goal: to,
      limit: String(NavitimeRouteConstant.MAX_RESULTS),
      start: from,
      start_time: startTime,
    });

    const res = await fetch(`${NavitimeRouteConstant.API_URL}?${params}`, {
      headers: {
        "X-RapidAPI-Host": NavitimeRouteConstant.API_HOST,
        "X-RapidAPI-Key": env.RAPIDAPI_KEY,
      },
      signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Navitime API error: ${res.status} — ${body}`);
    }

    const raw = await res.json();
    const parsed = NavitimeValidator.RESPONSE_VALIDATOR.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Navitime response validation failed: ${parsed.error.message}`);
    }
    const data = parsed.data;
    const routes: TransitRoute[] = (data.items ?? []).map((item) => ({
      arrive: item.summary.move.to_time,
      depart: item.summary.move.from_time,
      legs: this.mapSections(item.sections),
      referenceFare: item.summary.move.reference_fare
        ? {
            ic: item.summary.move.reference_fare.lowest_total_ic,
            ticket: item.summary.move.reference_fare.lowest_total_ticket,
          }
        : null,
      totalTime: item.summary.move.time,
      transfers: item.summary.move.transit_count,
    }));

    const cachedResponse = new Response(JSON.stringify(routes), {
      headers: {
        "Cache-Control": `public, max-age=${NavitimeRouteConstant.CACHE_TTL}`,
        "Content-Type": "application/json",
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { cachedAt: null, routes };
  }

  public static async stationAround(
    req: NavitimeTransportAroundRequest,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<{ cachedAt: null | string; items: TransportAroundNode[] }> {
    const params = new URLSearchParams({ coord: req.coord });
    if (req.term !== undefined) params.set("term", String(req.term));
    if (req.limit !== undefined) params.set("limit", String(req.limit));
    if (req.walk_speed !== undefined) params.set("walk_speed", String(req.walk_speed));
    if (req.datum !== undefined) params.set("datum", req.datum);
    if (req.coord_unit !== undefined) params.set("coord_unit", req.coord_unit);
    if (req.lang !== undefined) params.set("lang", req.lang);

    const cache = await caches.open("transit");
    const key = this.nodeCacheKey("around", params);
    const cached = await cache.match(key);
    if (cached) {
      const cachedAt = cached.headers.get("X-Cached-At");
      return { cachedAt, items: (await cached.json()) as TransportAroundNode[] };
    }

    const res = await fetch(
      `${NavitimeTransportConstant.API_ENDPOINT}/transport_node/around?${params}`,
      {
        headers: {
          "X-RapidAPI-Host": NavitimeTransportConstant.API_HOST,
          "X-RapidAPI-Key": env.RAPIDAPI_KEY,
        },
        signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
      },
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Navitime transport/around API error: ${res.status} — ${body}`);
    }

    const raw = await res.json();
    const parsed = NavitimeTransportAroundValidator.RESPONSE_VALIDATOR.safeParse(raw);
    if (!parsed.success) {
      throw new Error(
        `Navitime transport/around response validation failed: ${parsed.error.message}`,
      );
    }

    const items: TransportAroundNode[] = parsed.data.items.map((node) => ({
      ...this.mapNode(node),
      distanceMeters: node.distance,
      walkMinutes: node.time,
    }));

    const cachedResponse = new Response(JSON.stringify(items), {
      headers: {
        "Cache-Control": `public, max-age=${NavitimeTransportConstant.CACHE_TTL}`,
        "Content-Type": "application/json",
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { cachedAt: null, items };
  }

  public static async stationAutocomplete(
    req: NavitimeAutocompleteRequest,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<{ cachedAt: null | string; items: TransportAutocompleteNode[] }> {
    const params = new URLSearchParams({ word: req.word });
    if (req.word_match !== undefined) params.set("word_match", req.word_match);
    if (req.coord !== undefined) params.set("coord", req.coord);
    if (req.radius !== undefined) params.set("radius", String(req.radius));
    if (req.datum !== undefined) params.set("datum", req.datum);
    if (req.coord_unit !== undefined) params.set("coord_unit", req.coord_unit);
    if (req.lang !== undefined) params.set("lang", req.lang);

    const cache = await caches.open("transit");
    const key = this.nodeCacheKey("autocomplete", params);
    const cached = await cache.match(key);
    if (cached) {
      const cachedAt = cached.headers.get("X-Cached-At");
      return { cachedAt, items: (await cached.json()) as TransportAutocompleteNode[] };
    }

    const res = await fetch(
      `${NavitimeTransportConstant.API_ENDPOINT}/transport_node/autocomplete?${params}`,
      {
        headers: {
          "X-RapidAPI-Host": NavitimeTransportConstant.API_HOST,
          "X-RapidAPI-Key": env.RAPIDAPI_KEY,
        },
        signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
      },
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Navitime transport/autocomplete API error: ${res.status} — ${body}`);
    }

    const raw = await res.json();
    const parsed = NavitimeAutocompleteValidator.RESPONSE_VALIDATOR.safeParse(raw);
    if (!parsed.success) {
      throw new Error(
        `Navitime transport/autocomplete response validation failed: ${parsed.error.message}`,
      );
    }

    const items: TransportAutocompleteNode[] = parsed.data.items.map((node) => ({
      ...this.mapNode(node),
      numbering: node.numbering,
    }));

    const cachedResponse = new Response(JSON.stringify(items), {
      headers: {
        "Cache-Control": `public, max-age=${NavitimeTransportConstant.CACHE_TTL}`,
        "Content-Type": "application/json",
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { cachedAt: null, items };
  }

  public static async stationSearch(
    req: NavitimeTransportSearchRequest,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<{ cachedAt: null | string; result: TransportSearchResult }> {
    const params = new URLSearchParams({ word: req.word });
    if (req.offset !== undefined) params.set("offset", String(req.offset));
    if (req.limit !== undefined) params.set("limit", String(req.limit));
    if (req.lang !== undefined) params.set("lang", req.lang);
    if (req.datum !== undefined) params.set("datum", req.datum);
    if (req.coord_unit !== undefined) params.set("coord_unit", req.coord_unit);

    const cache = await caches.open("transit");
    const key = this.nodeCacheKey("search", params);
    const cached = await cache.match(key);
    if (cached) {
      const cachedAt = cached.headers.get("X-Cached-At");
      return { cachedAt, result: (await cached.json()) as TransportSearchResult };
    }

    const res = await fetch(`${NavitimeTransportConstant.API_ENDPOINT}/transport_node?${params}`, {
      headers: {
        "X-RapidAPI-Host": NavitimeTransportConstant.API_HOST,
        "X-RapidAPI-Key": env.RAPIDAPI_KEY,
      },
      signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Navitime transport/search API error: ${res.status} — ${body}`);
    }

    const raw = await res.json();
    const parsed = NavitimeTransportSearchValidator.RESPONSE_VALIDATOR.safeParse(raw);
    if (!parsed.success) {
      throw new Error(
        `Navitime transport/search response validation failed: ${parsed.error.message}`,
      );
    }

    const result: TransportSearchResult = {
      items: parsed.data.items.map(this.mapNode),
      limit: parsed.data.count.limit,
      offset: parsed.data.count.offset,
      total: parsed.data.count.total,
    };

    const cachedResponse = new Response(JSON.stringify(result), {
      headers: {
        "Cache-Control": `public, max-age=${NavitimeTransportConstant.CACHE_TTL}`,
        "Content-Type": "application/json",
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { cachedAt: null, result };
  }

  // ── Station node helpers ──────────────────────────────────────────────────────

  private static cacheKey(from: string, to: string, startTime: string): string {
    return `https://slim-portal-transit-cache/${encodeURIComponent(from)}/${encodeURIComponent(to)}/${encodeURIComponent(startTime)}`;
  }

  public static mapNode(node: NavitimeTransportNode): TransportNode {
    return {
      coord: { lat: node.coord.lat, lng: node.coord.lon },
      id: node.id,
      name: node.name,
      ruby: node.ruby,
      types: node.types,
    };
  }

  // ── Public methods ────────────────────────────────────────────────────────────

  public static mapSections(sections: NavitimeSection[]): TransitRoute["legs"] {
    const legs: TransitRoute["legs"] = [];
    sections.forEach((s, i) => {
      if (s.type !== "move") return;
      const move = s as NavitimeMoveSection;
      const from = (sections[i - 1] as NavitimePointSection | undefined)?.name ?? "";
      const to = (sections[i + 1] as NavitimePointSection | undefined)?.name ?? "";
      legs.push({
        arrive: move.to_time ?? null,
        color: move.transport?.color ?? null,
        depart: move.from_time ?? null,
        distance: move.distance ?? null,
        duration: move.time ?? null,
        from,
        getoff: move.transport?.getoff ?? null,
        line: move.transport?.name ?? move.line_name ?? "",
        platform: move.transport?.destination?.name ?? "",
        to,
      });
    });
    return legs;
  }

  private static nodeCacheKey(endpoint: string, params: URLSearchParams): string {
    return `https://slim-portal-transport-cache/${endpoint}/${params.toString()}`;
  }

  /** Round a "YYYY-MM-DDThh:mm:ss" string (already JST local) down to the hour */
  public static roundToHour(isoNoOffset: string): string {
    // "2026-05-25T10:30:00" → "2026-05-25T10:00:00"
    return isoNoOffset.slice(0, 14) + "00:00";
  }

  /** Convert a Date to "YYYY-MM-DDThh:mm:ss" in JST (UTC+9), no timezone suffix */
  public static toJSTString(date: Date): string {
    const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return jst.toISOString().slice(0, 19);
  }
}
