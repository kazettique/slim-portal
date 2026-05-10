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

```txt
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

| Layer              | Choice                        | Reason                                                 |
| ------------------ | ----------------------------- | ------------------------------------------------------ |
| Frontend           | Astro (static, minimal JS)    | Zero-JS by default, partial hydration, familiar        |
| Hosting (frontend) | Cloudflare Pages              | Free tier, globally distributed                        |
| Edge functions     | Cloudflare Workers            | Free 100k req/day, zero cold start, built-in Cache API |
| Caching            | CF Cache API + CF KV          | Free, no Redis needed at this scale                    |
| CSS                | Hand-written minimal CSS      | No frameworks, target < 8 KB                           |
| PWA                | Vanilla Service Worker (IIFE) | Cache app shell + last fetched content, no extra deps  |

---

## Monorepo Structure

```txt
slim-portal/
├── apps/
│   └── web/                  # Astro frontend
│       ├── src/
│       │   ├── pages/
│       │   │   ├── index.astro       # Home / dashboard
│       │   │   └── news.astro        # News reader (Phase 1 complete)
│       │   ├── layouts/
│       │   │   └── Base.astro
│       │   ├── styles/
│       │   │   └── global.css        # Minimal, < 8 KB target
│       │   ├── constant.ts
│       │   ├── type.ts
│       │   ├── util.ts
│       │   └── validator.ts          # Zod validators (web-only)
│       ├── public/
│       │   └── manifest.json         # PWA manifest
│       └── astro.config.mjs
│
├── packages/
│   └── share/                # @slim-portal/share — shared across web + worker
│       ├── src/
│       │   ├── constant.ts
│       │   ├── type.ts               # NewsItem interface (single source of truth)
│       │   └── validator.ts
│       ├── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── workers/
│   └── api/                  # Cloudflare Workers (single worker, route-based)
│       ├── src/
│       │   ├── index.ts              # Entry point, router
│       │   ├── constant.ts           # FEEDS array, timeouts, limits
│       │   ├── type.ts               # Env, Feed interfaces
│       │   ├── util.ts
│       │   ├── validator.ts
│       │   ├── routes/
│       │   │   └── news.ts           # GET /api/news
│       │   └── lib/
│       │       └── rss.ts            # RSS fetch + regex XML parser
│       ├── wrangler.toml
│       └── package.json
│
├── package.json              # Workspace root (Bun)
└── STARTUP.md                # This file
```

---

## Data Sources

### News

- **Source:** RSS feeds (no API key needed)
- **Active feeds:**
  - NHK World: `https://www3.nhk.or.jp/rss/news/cat0.xml`
  - BBC News: `https://feeds.bbci.co.uk/news/rss.xml`
- **Strip to:** `{ title, summary, url, publishedAt, source }`
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

```txt
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

| Feature           | Cache API TTL | KV TTL   |
| ----------------- | ------------- | -------- |
| News              | 15 min        | 30 min   |
| Place search      | 30 min        | 60 min   |
| Place details     | —             | 24 hours |
| Transit timetable | 1 hour        | 6 hours  |
| Real-time transit | No cache      | No cache |

---

## Payload Budget (enforce per page)

| Asset               | Hard limit  |
| ------------------- | ----------- |
| HTML                | 5 KB        |
| CSS (total)         | 8 KB        |
| JS (total)          | 30 KB       |
| API response (JSON) | 10 KB       |
| **Per view total**  | **< 55 KB** |

No images on data pages. Icons via inline SVG only (< 1 KB each).

---

## Environment Variables (Cloudflare Workers Secrets)

```txt
GOOGLE_PLACES_API_KEY=...
TRANSIT_API_KEY=...          # when applicable in Phase 3
CF_KV_NAMESPACE_ID=...       # set in wrangler.toml
```

---

## Build & Dev Commands

```bash
# Install dependencies (workspace root)
bun install

# Dev: frontend
bun run dev:web        # → cd apps/web && astro dev

# Dev: worker (local)
bun run dev:worker     # → cd workers/api && wrangler dev

# Type checking
bun run type:web       # → TypeScript check for apps/web
bun run type:worker    # → TypeScript check for workers/api
bun run type:share     # → TypeScript check for packages/share
bun run type:sw        # → TypeScript check for apps/web/src/sw.ts (WebWorker lib)

# Build & deploy
bun run build:web      # → bun build sw.ts (IIFE bundle) + astro build
bun run deploy:web     # → astro build + wrangler pages deploy
bun run deploy:worker  # → wrangler deploy
```

---

## Phase Plan

| Phase           | Scope                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **1 — Done ✓**  | Astro shell + CF Worker + RSS news reader (NHK + BBC). Architecture proven, zero API cost.                                      |
| **2 — Done ✓**  | Google Places proxy (location search + ratings).                                                                                |
| **3 — Blocked** | Japan transit lookup — waiting for Jorudan Open API credentials (applied 2026-05-10). Changes stashed as `phase-3-transit-wip`. |
| **4 — Done ✓**  | PWA: vanilla service worker, offline shell, last-content cache. SW bundled via `bun build` (IIFE, 2.6 KB).                      |

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

- Phases 1, 2, 4 complete. Phase 3 (transit) blocked — see Phase Plan above.
- Worker router uses URL pattern matching — no framework (no Hono needed unless routing gets complex)
- **RSS parsing**: Do NOT use `DOMParser`. The worker tsconfig uses `lib: ["ES2022"]` with no `"DOM"` — adding DOM lib causes conflicts with `@cloudflare/workers-types`. Use the pure regex parser already in `workers/api/src/lib/rss.ts` (`extractTag`, `extractLinkUrl`, `stripCdata`).
- **Package manager**: Bun everywhere — `bun install`, `bun run <script>`. Never use npm.
- **Shared package**: `packages/share` (`@slim-portal/share`, `workspace:*`) is the canonical location for cross-environment types, validators, and constants. Both `apps/web` and `workers/api` import from it.
- Keep `wrangler.toml` bindings explicit; add KV namespace binding only when caching layer is being built
- Run `bun run dev:worker` locally to test Workers before deploying — wrangler dev accurately emulates the CF runtime including Cache API
