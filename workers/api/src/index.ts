import type { Env } from "./type";

import { handleBathroomNearby } from "./route/bathroom";
import { handleNews } from "./route/news";
import {
  handlePlaceAutocomplete,
  handlePlaceDetail,
  handlePlaceNearby,
  handlePlaceSearch,
} from "./route/place";
import { handleSearch } from "./route/search";
import {
  handleTransit,
  handleTransitAround,
  handleTransitAutocomplete,
  handleTransitSearch,
} from "./route/transit";
import { HttpRequestMethod, HttpStatusCode } from "./type";
import { WorkerUtil } from "./util";

type RouteHandler = (request: Request, env: Env, ctx: ExecutionContext) => Promise<Response>;

// TODO: base url, page url constant in app
const GET_ROUTES: Record<string, RouteHandler> = {
  "/api/bathroom/nearby": handleBathroomNearby,
  "/api/news": handleNews,
  "/api/place/autocomplete": handlePlaceAutocomplete,
  "/api/place/detail": handlePlaceDetail,
  "/api/place/nearby": handlePlaceNearby,
  "/api/place/search": handlePlaceSearch,
  "/api/search": handleSearch,
  "/api/transit": handleTransit,
  "/api/transit/around": handleTransitAround,
  "/api/transit/autocomplete": handleTransitAutocomplete,
  "/api/transit/search": handleTransitSearch,
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const cors = WorkerUtil.corsHeaders(origin, env.ALLOWED_ORIGIN_DEV ?? "");

    if (request.method === HttpRequestMethod.OPTIONS) {
      return new Response(null, { headers: cors, status: HttpStatusCode.NO_CONTENT });
    }

    if (request.method === HttpRequestMethod.GET) {
      const handler = GET_ROUTES[url.pathname];
      if (handler) {
        const response = await handler(request, env, ctx);
        const headers = new Headers(response.headers);
        for (const [k, v] of Object.entries(cors)) headers.set(k, v);
        return new Response(response.body, { headers, status: response.status });
      }
    }

    return new Response("Not Found", { status: HttpStatusCode.NOT_FOUND });
  },
};
