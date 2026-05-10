import { SwConstant } from "./sw-constant";

const sw = self as unknown as ServiceWorkerGlobalScope;

abstract class SwHandler {
  public static install(event: ExtendableEvent): void {
    event.waitUntil(
      caches
        .open(SwConstant.SHELL_CACHE)
        .then((cache) => cache.addAll(SwConstant.SHELL_URLS))
        .then(() => sw.skipWaiting()),
    );
  }

  public static activate(event: ExtendableEvent): void {
    const keep = [SwConstant.SHELL_CACHE, SwConstant.API_CACHE];
    event.waitUntil(
      caches
        .keys()
        .then((keys) =>
          Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k))),
        )
        .then(() => sw.clients.claim()),
    );
  }

  public static async networkFirst(request: Request): Promise<Response> {
    const cache = await caches.open(SwConstant.API_CACHE);
    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;
      return new Response(JSON.stringify({ error: "Offline" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  public static async cacheFirst(request: Request): Promise<Response> {
    const cache = await caches.open(SwConstant.SHELL_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (err) {
      if (request.mode === "navigate") {
        const fallback = await cache.match("/");
        if (fallback) return fallback;
      }
      throw err;
    }
  }
}

sw.addEventListener("install", (event) => SwHandler.install(event));
sw.addEventListener("activate", (event) => SwHandler.activate(event));
sw.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== sw.location.origin) return;

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(SwHandler.networkFirst(event.request));
  } else {
    event.respondWith(SwHandler.cacheFirst(event.request));
  }
});
