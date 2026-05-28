import { SwConstant } from "./constant.sw";

const sw = self as unknown as ServiceWorkerGlobalScope;

abstract class SwHandler {
  public static install(event: ExtendableEvent): void {
    event.waitUntil(
      caches
        .open(SwConstant.SHELL_CACHE)
        // allSettled instead of cache.addAll: individual fetch failures don't
        // abort the install, so skipWaiting() always runs and the new SW
        // always activates (missed entries are filled in by cacheFirst at runtime).
        .then((cache) => Promise.allSettled(SwConstant.SHELL_URLS.map((url) => cache.add(url))))
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

    // CF Pages caches pages at /path/ but nav <a href> uses /path — retry with slash
    const url = new URL(request.url);
    if (!url.pathname.endsWith("/")) {
      const withSlash = await cache.match(new Request(url.origin + url.pathname + "/"));
      if (withSlash) return withSlash;
    }

    try {
      const response = await fetch(request);
      // Safari rejects any response with redirected:true served by a SW.
      // Re-fetch from the final URL to get a clean non-redirected response.
      if (response.redirected) {
        const clean = await fetch(response.url);
        if (clean.ok) cache.put(request, clean.clone());
        return clean;
      }
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

  public static async apiCacheFirst(request: Request): Promise<Response> {
    if (request.cache === "no-store") {
      return SwHandler.networkFirst(request);
    }
    const cache = await caches.open(SwConstant.API_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch {
      return new Response(JSON.stringify({ error: "Offline" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}

sw.addEventListener("install", (event) => SwHandler.install(event));
sw.addEventListener("activate", (event) => SwHandler.activate(event));
sw.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== sw.location.origin) return;

  if (url.pathname === "/api/search") {
    event.respondWith(SwHandler.apiCacheFirst(event.request));
  } else if (url.pathname.startsWith("/api/")) {
    event.respondWith(SwHandler.networkFirst(event.request));
  } else {
    event.respondWith(SwHandler.cacheFirst(event.request));
  }
});
