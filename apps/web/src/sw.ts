import { ShareConstant } from "@slim-portal/share/constant";

const sw = self as unknown as ServiceWorkerGlobalScope;

abstract class SwHandler {
  public static readonly API_CACHE: string = "api-v1";
  public static readonly MAX_API_ENTRIES: number = 60;
  public static readonly SHELL_CACHE: string = "shell-v6";
  // CF Pages serves pages at trailing-slash URLs (/bookmark/ not /bookmark).
  // Fetching without trailing slash causes a 301 redirect, and Safari refuses
  // to serve a redirected response from a service worker. Use trailing slashes
  // here so cache.addAll() fetches the canonical URLs directly (200, no redirect).
  public static readonly SHELL_URLS: string[] = ShareConstant.PAGE_URLS.map((url) =>
    url === "/" ? url : `${url}/`,
  );

  public static activate(event: ExtendableEvent): void {
    const keep = [this.SHELL_CACHE, this.API_CACHE];
    event.waitUntil(
      caches
        .keys()
        .then((keys) =>
          Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k))),
        )
        .then(async () => {
          // Evict stale /_astro/ entries from the shell cache using the manifest
          // written during install. Prevents old content-hashed assets from accumulating
          // across deployments.
          const cache = await caches.open(this.SHELL_CACHE);
          const manifest = await cache.match("/__sw_asset_manifest");
          if (manifest) {
            const current = new Set<string>((await manifest.json()) as string[]);
            const keys = await cache.keys();
            await Promise.all(
              keys
                .filter((req) => {
                  const { pathname } = new URL(req.url);
                  return pathname.startsWith("/_astro/") && !current.has(pathname);
                })
                .map((req) => cache.delete(req)),
            );
          }
        })
        .then(() => sw.clients.claim()),
    );
  }

  public static async apiCacheFirst(request: Request): Promise<Response> {
    if (request.cache === "no-store") {
      return this.networkFirst(request);
    }
    const cache = await caches.open(this.API_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok) {
        await this.guardApiCache(cache);
        cache.put(request, response.clone());
      }
      return response;
    } catch {
      return new Response(JSON.stringify({ error: "Offline" }), {
        headers: { "Content-Type": "application/json" },
        status: 503,
      });
    }
  }

  public static async cacheFirst(request: Request): Promise<Response> {
    const cache = await caches.open(this.SHELL_CACHE);
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
        const fallback = await cache.match("/offline/");
        if (fallback) return fallback;
      }
      throw err;
    }
  }

  public static install(event: ExtendableEvent): void {
    event.waitUntil(
      caches
        .open(this.SHELL_CACHE)
        // allSettled instead of cache.addAll: individual fetch failures don't
        // abort the install, so skipWaiting() always runs and the new SW
        // always activates (missed entries are filled in by cacheFirst at runtime).
        .then((cache) => Promise.allSettled(this.SHELL_URLS.map((url) => cache.add(url))))
        .then(async () => {
          // Extract hashed /_astro/ assets from the cached home page and pre-cache them.
          // Astro uses content-hashed filenames unknown at SW build time, so we read
          // them dynamically from the already-cached HTML instead of hardcoding paths.
          const cache = await caches.open(this.SHELL_CACHE);
          const htmlPages = await Promise.all(this.SHELL_URLS.map((url) => cache.match(url)));
          const htmlTexts = await Promise.all(
            htmlPages.filter((r): r is Response => r != null).map((r) => r.text()),
          );
          const allHtml = htmlTexts.join("\n");
          const matches = allHtml.match(/\/_astro\/[^"'\s]+\.(?:css|js)/g);
          if (matches) {
            const assetUrls = [...new Set(matches)];
            // Persist manifest so activate can evict stale /_astro/ entries on next SW update
            await cache.put(
              "/__sw_asset_manifest",
              new Response(JSON.stringify(assetUrls), {
                headers: { "Content-Type": "application/json" },
              }),
            );
            await Promise.allSettled(assetUrls.map((url) => cache.add(url)));
          }
        })
        .then(() => sw.skipWaiting()),
    );
  }

  public static async networkFirst(request: Request): Promise<Response> {
    const cache = await caches.open(this.API_CACHE);
    try {
      const response = await fetch(request);
      if (response.ok) {
        await this.guardApiCache(cache);
        cache.put(request, response.clone());
      }
      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;
      return new Response(JSON.stringify({ error: "Offline" }), {
        headers: { "Content-Type": "application/json" },
        status: 503,
      });
    }
  }

  private static async guardApiCache(cache: Cache): Promise<void> {
    const keys = await cache.keys();
    if (keys.length >= this.MAX_API_ENTRIES) {
      // Evict exactly 1 slot before the upcoming put so the cache never exceeds MAX
      await Promise.all(
        keys.slice(0, keys.length - this.MAX_API_ENTRIES + 1).map((k) => cache.delete(k)),
      );
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
