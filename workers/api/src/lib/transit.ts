import {
  TransitRoute,
  TransportAroundNode,
  TransportAutocompleteNode,
  TransportNode,
  TransportSearchResult,
} from "@slim-portal/share";
import { WorkerConstant } from "../constant";
import { Env } from "../type";
import { NavitimeRouteConstant } from "../external/navitime/route/constant";
import { NavitimeMoveSection, NavitimePointSection, NavitimeSection } from "../external/navitime/route/type";
import { NavitimeValidator } from "../external/navitime/route/validator";
import { NavitimeTransportConstant } from "../external/navitime/transport/constant";
import { NavitimeTransportNode } from "../external/navitime/transport/type";
import { NavitimeTransportSearchRequest } from "../external/navitime/transport/search/type";
import { NavitimeTransportSearchValidator } from "../external/navitime/transport/search/validator";
import { NavitimeTransportAroundRequest } from "../external/navitime/transport/around/type";
import { NavitimeTransportAroundValidator } from "../external/navitime/transport/around/validator";
import { NavitimeAutocompleteRequest } from "../external/navitime/transport/autocomplete/type";
import { NavitimeAutocompleteValidator } from "../external/navitime/transport/autocomplete/validator";

export abstract class TransitLib {
  // ── Route helpers ────────────────────────────────────────────────────────────

  private static cacheKey(from: string, to: string, startTime: string): string {
    return `https://slim-portal-transit-cache/${encodeURIComponent(from)}/${encodeURIComponent(to)}/${encodeURIComponent(startTime)}`;
  }

  private static roundToHour(isoLocal: string): string {
    const d = new Date(isoLocal);
    d.setMinutes(0, 0, 0);
    // Navitime expects "YYYY-MM-DDThh:mm:ss" without timezone
    return d.toISOString().slice(0, 19);
  }

  private static mapSections(sections: NavitimeSection[]): TransitRoute["legs"] {
    const legs: TransitRoute["legs"] = [];
    sections.forEach((s, i) => {
      if (s.type !== "move") return;
      const move = s as NavitimeMoveSection;
      const from = (sections[i - 1] as NavitimePointSection | undefined)?.name ?? "";
      const to = (sections[i + 1] as NavitimePointSection | undefined)?.name ?? "";
      legs.push({
        line: move.transport?.name ?? move.line_name ?? "",
        from,
        to,
        depart: move.from_time ?? null,
        arrive: move.to_time ?? null,
        platform: move.transport?.destination?.name ?? "",
      });
    });
    return legs;
  }

  // ── Station node helpers ──────────────────────────────────────────────────────

  private static nodeCacheKey(endpoint: string, params: URLSearchParams): string {
    return `https://slim-portal-transport-cache/${endpoint}/${params.toString()}`;
  }

  private static mapNode(node: NavitimeTransportNode): TransportNode {
    return {
      id: node.id,
      name: node.name,
      ruby: node.ruby,
      types: node.types,
      coord: { lat: node.coord.lat, lng: node.coord.lon },
    };
  }

  // ── Public methods ────────────────────────────────────────────────────────────

  public static async search(
    from: string,
    to: string,
    datetime: string | undefined,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<{ routes: TransitRoute[]; cachedAt: string | null }> {
    const startTime = datetime
      ? this.roundToHour(datetime)
      : this.roundToHour(new Date().toISOString());

    const cache = await caches.open("transit");
    const key = this.cacheKey(from, to, startTime);
    const cached = await cache.match(key);
    if (cached) {
      const cachedAt = cached.headers.get("X-Cached-At");
      return { routes: (await cached.json()) as TransitRoute[], cachedAt };
    }

    const params = new URLSearchParams({
      start: from,
      goal: to,
      start_time: startTime,
      limit: String(NavitimeRouteConstant.MAX_RESULTS),
      lang: NavitimeRouteConstant.DEFAULT_LANG,
    });

    const res = await fetch(`${NavitimeRouteConstant.API_URL}?${params}`, {
      headers: {
        "X-RapidAPI-Key": env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": NavitimeRouteConstant.API_HOST,
      },
      signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
    });

    if (!res.ok) throw new Error(`Navitime API error: ${res.status}`);

    const raw = await res.json();
    const parsed = NavitimeValidator.RESPONSE_VALIDATOR.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Navitime response validation failed: ${parsed.error.message}`);
    }
    const data = parsed.data;
    const routes: TransitRoute[] = (data.items ?? []).map((item) => ({
      legs: this.mapSections(item.sections),
      totalTime: item.summary.move.time,
      transfers: item.summary.move.transit_count,
      depart: item.summary.move.from_time,
      arrive: item.summary.move.to_time,
    }));

    const cachedResponse = new Response(JSON.stringify(routes), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${NavitimeRouteConstant.CACHE_TTL}`,
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { routes, cachedAt: null };
  }

  public static async stationSearch(
    req: NavitimeTransportSearchRequest,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<{ result: TransportSearchResult; cachedAt: string | null }> {
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
      return { result: (await cached.json()) as TransportSearchResult, cachedAt };
    }

    const res = await fetch(`${NavitimeTransportConstant.API_ENDPOINT}/transport_node?${params}`, {
      headers: {
        "X-RapidAPI-Key": env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": NavitimeTransportConstant.API_HOST,
      },
      signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
    });

    if (!res.ok) throw new Error(`Navitime transport/search API error: ${res.status}`);

    const raw = await res.json();
    const parsed = NavitimeTransportSearchValidator.RESPONSE_VALIDATOR.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Navitime transport/search response validation failed: ${parsed.error.message}`);
    }

    const result: TransportSearchResult = {
      total: parsed.data.count.total,
      offset: parsed.data.count.offset,
      limit: parsed.data.count.limit,
      items: parsed.data.items.map(this.mapNode),
    };

    const cachedResponse = new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${NavitimeTransportConstant.CACHE_TTL}`,
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { result, cachedAt: null };
  }

  public static async stationAround(
    req: NavitimeTransportAroundRequest,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<{ items: TransportAroundNode[]; cachedAt: string | null }> {
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
      return { items: (await cached.json()) as TransportAroundNode[], cachedAt };
    }

    const res = await fetch(
      `${NavitimeTransportConstant.API_ENDPOINT}/transport_node/around?${params}`,
      {
        headers: {
          "X-RapidAPI-Key": env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": NavitimeTransportConstant.API_HOST,
        },
        signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
      },
    );

    if (!res.ok) throw new Error(`Navitime transport/around API error: ${res.status}`);

    const raw = await res.json();
    const parsed = NavitimeTransportAroundValidator.RESPONSE_VALIDATOR.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Navitime transport/around response validation failed: ${parsed.error.message}`);
    }

    const items: TransportAroundNode[] = parsed.data.items.map((node) => ({
      ...this.mapNode(node),
      distanceMeters: node.distance,
      walkMinutes: node.time,
    }));

    const cachedResponse = new Response(JSON.stringify(items), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${NavitimeTransportConstant.CACHE_TTL}`,
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { items, cachedAt: null };
  }

  public static async stationAutocomplete(
    req: NavitimeAutocompleteRequest,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<{ items: TransportAutocompleteNode[]; cachedAt: string | null }> {
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
      return { items: (await cached.json()) as TransportAutocompleteNode[], cachedAt };
    }

    const res = await fetch(
      `${NavitimeTransportConstant.API_ENDPOINT}/transport_node/autocomplete?${params}`,
      {
        headers: {
          "X-RapidAPI-Key": env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": NavitimeTransportConstant.API_HOST,
        },
        signal: AbortSignal.timeout(WorkerConstant.REQUEST_TIMEOUT),
      },
    );

    if (!res.ok) throw new Error(`Navitime transport/autocomplete API error: ${res.status}`);

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
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${NavitimeTransportConstant.CACHE_TTL}`,
        "X-Cached-At": new Date().toISOString(),
      },
    });
    ctx.waitUntil(cache.put(key, cachedResponse));

    return { items, cachedAt: null };
  }
}
