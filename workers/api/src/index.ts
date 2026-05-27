import { handleNews } from "./route/news";
import {
  handlePlaceSearch,
  handlePlaceAutocomplete,
  handlePlaceDetail,
  handlePlaceNearby,
} from "./route/place";
import { handleSearch } from "./route/search";
import { handleTransit, handleTransitSearch, handleTransitAround, handleTransitAutocomplete } from "./route/transit";
import { handleBathroomNearby } from "./route/bathroom";
import { Env, HttpRequestMethod, HttpStatusCode } from "./type";
import { WorkerUtil } from "./util";

type RouteHandler = (request: Request, env: Env, ctx: ExecutionContext) => Promise<Response>;

// TODO: base url, page url constant in app
const GET_ROUTES: Record<string, RouteHandler> = {
  "/api/news": handleNews,
  "/api/place/search": handlePlaceSearch,
  "/api/place/autocomplete": handlePlaceAutocomplete,
  "/api/place/detail": handlePlaceDetail,
  "/api/place/nearby": handlePlaceNearby,
  "/api/search": handleSearch,
  "/api/transit": handleTransit,
  "/api/transit/search": handleTransitSearch,
  "/api/transit/around": handleTransitAround,
  "/api/transit/autocomplete": handleTransitAutocomplete,
  "/api/bathroom/nearby": handleBathroomNearby,
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const cors = WorkerUtil.corsHeaders(origin, env.ALLOWED_ORIGIN_DEV ?? "");

    if (request.method === HttpRequestMethod.OPTIONS) {
      return new Response(null, { status: HttpStatusCode.NO_CONTENT, headers: cors });
    }

    if (request.method === HttpRequestMethod.GET) {
      const handler = GET_ROUTES[url.pathname];
      if (handler) {
        const response = await handler(request, env, ctx);
        const headers = new Headers(response.headers);
        for (const [k, v] of Object.entries(cors)) headers.set(k, v);
        return new Response(response.body, { status: response.status, headers });
      }
    }

    return new Response("Not Found", { status: HttpStatusCode.NOT_FOUND });
  },
};
