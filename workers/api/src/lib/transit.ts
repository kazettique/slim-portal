import { TransitRoute } from "@slim-portal/share";
import { WorkerConstant } from "../constant";
import { Env } from "../type";
import { NavitimeRouteConstant } from "../external/navitime/route/constant";
import { NavitimeMoveSection, NavitimePointSection, NavitimeSection, NavitimeTransitResponse } from "../external/navitime/route/type";

export abstract class TransitLib {
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

    const data = (await res.json()) as NavitimeTransitResponse;
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
}
