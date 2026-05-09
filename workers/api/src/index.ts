import { handleNews } from "./routes/news";
import { Env } from "./type";

function corsHeaders(origin: string | null, allowedOriginDev: string): Record<string, string> {
  if (origin && allowedOriginDev && origin === allowedOriginDev) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
  }
  return {};
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const cors = corsHeaders(origin, env.ALLOWED_ORIGIN_DEV ?? "");

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === "GET" && url.pathname === "/api/news") {
      const response = await handleNews(request, env, ctx);
      const headers = new Headers(response.headers);
      for (const [k, v] of Object.entries(cors)) {
        headers.set(k, v);
      }
      return new Response(response.body, { status: response.status, headers });
    }

    return new Response("Not Found", { status: 404 });
  },
};
