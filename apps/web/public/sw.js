(() => {
  // ../../packages/share/src/constant.ts
  class ShareConstant {
    static PAGE_URL_HOME = "/";
    static PAGE_URL_NEWS = "/news";
    static PAGE_URL_PLACES = "/places";
    static PAGE_URL_PLACES_NEARBY = "/places/nearby";
    static PAGE_URL_PLACES_DETAILS = "/places/details";
    static PAGE_URL_SEARCH = "/search";
    static PAGE_URL_TRANSIT = "/transit";
    static PAGE_URL_CONVERTER = "/converter";
    static PAGE_URL_YEAR_CONVERTER = "/converter/year-converter";
    static PAGE_URL_AREA_CONVERTER = "/converter/area-converter";
    static PAGE_URL_SETTINGS = "/settings";
    static PAGE_URL_BATHROOMS = "/bathrooms";
    static PAGE_URL_BOOKMARKS = "/bookmarks";
    static PAGE_URLS = [
      this.PAGE_URL_HOME,
      this.PAGE_URL_NEWS,
      this.PAGE_URL_PLACES,
      this.PAGE_URL_SEARCH,
      this.PAGE_URL_TRANSIT,
      this.PAGE_URL_CONVERTER,
      this.PAGE_URL_YEAR_CONVERTER,
      this.PAGE_URL_AREA_CONVERTER,
      this.PAGE_URL_SETTINGS,
      this.PAGE_URL_BATHROOMS,
      this.PAGE_URL_BOOKMARKS
    ];
  }

  // src/sw-constant.ts
  class SwConstant {
    static SHELL_CACHE = "shell-v1";
    static API_CACHE = "api-v1";
    static SHELL_URLS = ShareConstant.PAGE_URLS;
  }

  // src/sw.ts
  var sw = self;

  class SwHandler {
    static install(event) {
      event.waitUntil(caches.open(SwConstant.SHELL_CACHE).then((cache) => cache.addAll(SwConstant.SHELL_URLS)).then(() => sw.skipWaiting()));
    }
    static activate(event) {
      const keep = [SwConstant.SHELL_CACHE, SwConstant.API_CACHE];
      event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k)))).then(() => sw.clients.claim()));
    }
    static async networkFirst(request) {
      const cache = await caches.open(SwConstant.API_CACHE);
      try {
        const response = await fetch(request);
        if (response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      } catch {
        const cached = await cache.match(request);
        if (cached)
          return cached;
        return new Response(JSON.stringify({ error: "Offline" }), {
          status: 503,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    static async cacheFirst(request) {
      const cache = await caches.open(SwConstant.SHELL_CACHE);
      const cached = await cache.match(request);
      if (cached)
        return cached;
      try {
        const response = await fetch(request);
        if (response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      } catch (err) {
        if (request.mode === "navigate") {
          const fallback = await cache.match("/");
          if (fallback)
            return fallback;
        }
        throw err;
      }
    }
    static async apiCacheFirst(request) {
      if (request.cache === "no-store") {
        return SwHandler.networkFirst(request);
      }
      const cache = await caches.open(SwConstant.API_CACHE);
      const cached = await cache.match(request);
      if (cached)
        return cached;
      try {
        const response = await fetch(request);
        if (response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      } catch {
        return new Response(JSON.stringify({ error: "Offline" }), {
          status: 503,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
  }
  sw.addEventListener("install", (event) => SwHandler.install(event));
  sw.addEventListener("activate", (event) => SwHandler.activate(event));
  sw.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    if (url.origin !== sw.location.origin)
      return;
    if (url.pathname === "/api/search") {
      event.respondWith(SwHandler.apiCacheFirst(event.request));
    } else if (url.pathname.startsWith("/api/")) {
      event.respondWith(SwHandler.networkFirst(event.request));
    } else {
      event.respondWith(SwHandler.cacheFirst(event.request));
    }
  });
})();
