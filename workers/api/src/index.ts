import { handleNews } from "./routes/news";
import { handlePlaces } from "./routes/places";
import { Env, HttpRequestMethod, HttpStatusCode } from "./type";
import { WorkerUtil } from "./util";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const cors = WorkerUtil.corsHeaders(origin, env.ALLOWED_ORIGIN_DEV ?? "");

    if (request.method === HttpRequestMethod.OPTIONS) {
      return new Response(null, { status: HttpStatusCode.NO_CONTENT, headers: cors });
    }

    // TODO: base url, page url constant in app
    if (request.method === HttpRequestMethod.GET && url.pathname === "/api/news") {
      const response = await handleNews(request, env, ctx);
      const headers = new Headers(response.headers);
      for (const [k, v] of Object.entries(cors)) {
        headers.set(k, v);
      }
      return new Response(response.body, { status: response.status, headers });
    }

    if (request.method === HttpRequestMethod.GET && url.pathname === "/api/places") {
      const response = await handlePlaces(request, env, ctx);
      const headers = new Headers(response.headers);
      for (const [k, v] of Object.entries(cors)) {
        headers.set(k, v);
      }
      return new Response(response.body, { status: response.status, headers });
    }

    return new Response("Not Found", { status: HttpStatusCode.NOT_FOUND });
  },
};
