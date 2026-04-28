# Slim Portal — Project Startup Guide

## Project Overview

A lightweight web portal designed for **slow mobile networks (128kbps)**. Acts as a middle layer that fetches, strips, and serves only essential text-based information to the client. Target page weight: **< 55 KB per view**.

Features (in priority order):
1. Text-based news reader (RSS)
2. Nearby location search with ratings (Google Places)
3. Japan transit transfer lookup
4. (Future) General text navigation

---

## Architecture

```
Browser (Astro PWA)
  │
  ├─ fetch /api/news
  ├─ fetch /api/places?q=...&lat=...&lng=...
  └─ fetch /api/transit?from=...&to=...
  │
  ▼
Cloudflare Workers (edge proxy + data stripper)
  │
  ├─ RSS feeds        → parse XML → {title, summary, url, date}[]
  ├─ Google Places    → strip response → {name, rating, address, distance}[]
  └─ Transit API      → {route, time, transfers, platform}[]
  │
  ▼
External APIs (keys never exposed to client)
```

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Astro (static, minimal JS) | Zero-JS by default, partial hydration, familiar |
| Hosting (frontend) | Cloudflare Pages | Free tier, globally distributed |
| Edge functions | Cloudflare Workers | Free 100k req/day, zero cold start, built-in Cache API |
| Caching | CF Cache API + CF KV | Free, no Redis needed at this scale |
| CSS | Hand-written minimal CSS | No frameworks, target < 8 KB |
| PWA | Service Worker (Astro plugin) | Cache app shell + last fetched content |

---

## Monorepo Structure

```
slim-portal/
├── apps/
│   └── web/                  # Astro frontend
│       ├── src/
│       │   ├── pages/
│       │   │   ├── index.astro       # Home / dashboard
│       │   │   ├── news.astro        # News reader
│       │   │   ├── places.astro      # Location search
│       │   │   └── transit.astro     # Transit lookup
│       │   ├── components/
│       │   ├── layouts/
│       │   │   └── Base.astro
│       │   └── styles/
│       │       └── global.css        # Minimal, < 8 KB target
│       ├── public/
│       │   └── manifest.json         # PWA manifest
│       └── astro.config.mjs
│
├── workers/
│   └── api/                  # Cloudflare Workers (single worker, route-based)
│       ├── src/
│       │   ├── index.ts              # Entry point, router
│       │   ├── routes/
│       │   │   ├── news.ts           # GET /api/news
│       │   │   ├── places.ts         # GET /api/places
│       │   │   └── transit.ts        # GET /api/transit
│       │   ├── lib/
│       │   │   ├── cache.ts          # CF Cache API + KV helpers
│       │   │   ├── rss.ts            # RSS fetch + XML strip
│       │   │   └── strip.ts          # Generic response minimizer
│       │   └── types.ts
│       ├── wrangler.toml
│       └── package.json
│
├── package.json              # Workspace root
└── STARTUP.md                # This file
```

---

## Data Sources

### News
- **Source:** RSS feeds (no API key needed)
- **Suggested feeds:**
  - NHK World: `https://www3.nhk.or.jp/rss/news/cat0.xml`
  - Reuters: `https://feeds.reuters.com/reuters/topNews`
- **Strip to:** `{ title, summary, url, publishedAt }`
- **Cache TTL:** 15 minutes (CF Cache API)

### Location Search (Places)
- **Source:** Google Places API — Text Search + Place Details
- **Env var:** `GOOGLE_PLACES_API_KEY` (Workers secret)
- **Strip to:** `{ name, rating, totalRatings, address, distanceMeters, mapsUrl }`
- **Cache TTL:** 30–60 minutes (CF Cache API, keyed by query+coords)
- **Note:** $200/month free credit from Google covers ~4k–7k searches

### Transit (Japan)
- **Source (Phase 3):** Evaluate in order:
  1. [国土交通省 GTFS-JP open data](https://www.mlit.go.jp/sogoseisaku/transport/sosei_transport_tk_000035.html) — free, requires self-parsing
  2. [Jorudan Transit API](https://roadsign.jp/api/) — paid, simple
  3. [Yahoo! 乗換案内 API](https://developer.yahoo.co.jp/webapi/map/openlocalplatform/v1/routesearch.html) — free tier available
- **Strip to:** `{ legs[{ line, from, to, depart, arrive, platform }], totalTime, transfers }`
- **Cache TTL:** 1 hour for timetable data; no cache for real-time

---

## Caching Strategy

```
Request hits Worker
  │
  ├─ Check CF Cache API (in-memory, per edge node)
  │     Hit → return immediately (< 1ms)
  │     Miss ↓
  ├─ Check CF KV (persistent, global)
  │     Hit → return + repopulate Cache API
  │     Miss ↓
  └─ Fetch external API → strip → store in KV + Cache API → return
```

| Feature | Cache API TTL | KV TTL |
|---|---|---|
| News | 15 min | 30 min |
| Place search | 30 min | 60 min |
| Place details | — | 24 hours |
| Transit timetable | 1 hour | 6 hours |
| Real-time transit | No cache | No cache |

---

## Payload Budget (enforce per page)

| Asset | Hard limit |
|---|---|
| HTML | 5 KB |
| CSS (total) | 8 KB |
| JS (total) | 30 KB |
| API response (JSON) | 10 KB |
| **Per view total** | **< 55 KB** |

No images on data pages. Icons via inline SVG only (< 1 KB each).

---

## Environment Variables (Cloudflare Workers Secrets)

```
GOOGLE_PLACES_API_KEY=...
TRANSIT_API_KEY=...          # when applicable in Phase 3
CF_KV_NAMESPACE_ID=...       # set in wrangler.toml
```

---

## Build & Dev Commands

```bash
# Install dependencies (workspace root)
npm install

# Dev: frontend
npm run dev:web        # → cd apps/web && astro dev

# Dev: worker (local)
npm run dev:worker     # → cd workers/api && wrangler dev

# Deploy frontend
npm run deploy:web     # → astro build + wrangler pages deploy

# Deploy worker
npm run deploy:worker  # → wrangler deploy
```

---

## Phase Plan

| Phase | Scope |
|---|---|
| **1 — Now** | Astro shell + CF Worker + RSS news reader. Proves architecture, zero API cost. |
| **2** | Google Places proxy (location search + ratings). |
| **3** | Japan transit lookup (evaluate GTFS vs Jorudan). |
| **4** | PWA: service worker, offline shell, last-content cache. |

---

## Design Constraints (enforce throughout)

- **No CSS frameworks** (no Tailwind, no Bootstrap)
- **No images** on data pages
- **No web fonts** — system font stack only: `font-family: system-ui, sans-serif`
- **No client-side tracking** or analytics scripts
- **No cookies** unless strictly necessary
- JS on the frontend should be **progressive enhancement only** — pages must be readable without JS
- All API calls go through the Worker — **never call external APIs directly from the browser**

---

## Notes for Claude Code

- Start with **Phase 1 only** — do not scaffold Phase 2/3 routes until Phase 1 is working end-to-end
- Worker router should use URL pattern matching, not a heavy framework (no Hono needed unless routing gets complex)
- RSS parsing: use native `DOMParser` in the Worker (available in CF Workers runtime) or a minimal XML parser — no heavy libraries
- Keep `wrangler.toml` bindings explicit; add KV namespace binding only when caching layer is being built
- Run `wrangler dev` locally to test Workers before deploying — it accurately emulates the CF runtime including Cache API
