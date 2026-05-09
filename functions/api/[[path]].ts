interface Env {
  WORKER_URL: string;
}

export const onRequest = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  if (!env.WORKER_URL) {
    return new Response(JSON.stringify({ error: "WORKER_URL not configured" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
  const url = new URL(request.url);
  const target = env.WORKER_URL + url.pathname + url.search;
  return fetch(new Request(target, request));
};
