interface Env {
  WORKER_URL: string;
}

export const onRequest = async ({
  env,
  request,
}: {
  env: Env;
  request: Request;
}): Promise<Response> => {
  if (!env.WORKER_URL) {
    return new Response(JSON.stringify({ error: "WORKER_URL not configured" }), {
      headers: { "Content-Type": "application/json" },
      status: 502,
    });
  }
  const url = new URL(request.url);
  const target = env.WORKER_URL + url.pathname + url.search;
  return fetch(new Request(target, request));
};
