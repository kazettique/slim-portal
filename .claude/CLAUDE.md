# Slim Portal — Project Guide

## Project Overview

A lightweight web portal designed for **slow mobile networks (128kbps)**. Acts as a middle layer that fetches, strips, and serves only essential text-based information to the client. Target page weight: **< 55 KB per view**.

Features (priority order):

1. Text-based news reader (RSS)
2. Nearby location search with ratings (Google Maps)
3. Japan transit transfer lookup (Navitime)
4. Text search (DuckDuckGo)
5. Public bathroom finder
6. Unit converters (year era, area)
7. Bookmark / saved searches
8. Settings (cache management, time format, network usage)

---

## Architecture

```txt
Browser (Astro PWA)
  │
  ├─ fetch /api/news
  ├─ fetch /api/place/search|nearby|detail|autocomplete
  ├─ fetch /api/search?q=...
  ├─ fetch /api/transit|transit/search|transit/around|transit/autocomplete
  └─ fetch /api/bathroom/nearby
  │
  ▼
Cloudflare Workers (edge proxy + data stripper)
  │
  ├─ RSS feeds        → parse XML → NewsItem[]
  ├─ Google Maps      → strip response → PlaceItem[]
  ├─ DuckDuckGo       → strip response → SearchItem[]
  ├─ Navitime         → strip response → TransitRoute[]
  └─ Public Bathrooms → strip response → BathroomItem[]
  │
  ▼
External APIs via RapidAPI (RAPIDAPI_KEY — never exposed to client)
```

---

## Tech Stack

| Layer              | Choice                        | Reason                                                |
| ------------------ | ----------------------------- | ----------------------------------------------------- |
| Frontend           | Astro 6 (static, minimal JS)  | Zero-JS by default, partial hydration, familiar       |
| Hosting (frontend) | Cloudflare Pages              | Free tier, globally distributed                       |
| Edge functions     | Cloudflare Workers            | Free 100k req/day, zero cold start, Cache API         |
| Caching            | CF Cache API                  | KV bindings exist but currently commented out         |
| CSS                | Hand-written minimal CSS      | No frameworks, target < 8 KB                          |
| PWA                | Vanilla Service Worker (IIFE) | Cache app shell + last fetched content, no extra deps |
| Package manager    | Bun                           | Workspace monorepo                                    |
| Validation         | Zod 4                         | Runtime schema validation                             |

---

## Monorepo Structure

```txt
slim-portal/
├── apps/
│   └── web/                           # Astro frontend (PWA)
│       ├── src/
│       │   ├── pages/
│       │   │   ├── index.astro        # Home / dashboard
│       │   │   ├── news.astro
│       │   │   ├── search.astro
│       │   │   ├── place.astro
│       │   │   ├── transit.astro
│       │   │   ├── bathroom.astro
│       │   │   ├── bookmark.astro
│       │   │   ├── settings.astro
│       │   │   ├── converter/
│       │   │   │   ├── index.astro
│       │   │   │   ├── year-converter.astro
│       │   │   │   └── area-converter.astro
│       │   │   └── place/
│       │   │       ├── nearby.astro
│       │   │       └── detail.astro
│       │   ├── layout/
│       │   │   └── Base.astro         # Master layout
│       │   ├── style/
│       │   │   └── global.css         # Global + component styles (< 8 KB)
│       │   ├── constant.ts
│       │   ├── type.ts                # PageMeta
│       │   ├── validator.ts
│       │   ├── util.ts
│       │   ├── util.bookmark.ts
│       │   ├── util.settings.ts
│       │   ├── util.transit.ts
│       │   ├── util.converter.ts
│       │   ├── type.bookmark.ts
│       │   ├── type.settings.ts
│       │   ├── type.converter.ts
│       │   ├── sw.ts                  # Service Worker source
│       │   └── constant.sw.ts
│       ├── public/
│       │   └── manifest.json          # PWA manifest
│       ├── astro.config.mjs
│       ├── tsconfig.json
│       └── tsconfig.sw.json           # Separate TS config for SW (WebWorker lib)
│
├── packages/
│   └── share/                         # @slim-portal/share (workspace:*)
│       ├── src/
│       │   ├── type.ts                # NewsItem, PlaceItem, SearchItem, etc.
│       │   ├── constant.ts            # PAGE_URL_*, API route paths
│       │   └── validator.ts           # Shared Zod schemas
│       ├── index.ts
│       └── package.json
│
├── workers/
│   └── api/                           # Cloudflare Workers (single worker, route-based)
│       ├── src/
│       │   ├── index.ts               # Entry point, router
│       │   ├── constant.ts
│       │   ├── type.ts                # Env, Feed, HTTP enums
│       │   ├── validator.ts
│       │   ├── util.ts
│       │   ├── route/                 # Route handlers
│       │   │   ├── news.ts
│       │   │   ├── place.ts
│       │   │   ├── search.ts
│       │   │   ├── transit.ts
│       │   │   └── bathroom.ts
│       │   ├── lib/                   # Business logic
│       │   │   ├── rss.ts             # RSS fetch + regex XML parser (no DOMParser)
│       │   │   ├── place.ts
│       │   │   ├── search.ts
│       │   │   ├── transit.ts
│       │   │   └── bathroom.ts
│       │   └── external/              # Provider-specific types, validators, constants
│       │       ├── duckduckgo/
│       │       ├── googleMap/
│       │       │   └── places/        # autocomplete/, detail/, searchNearby/, searchText/
│       │       ├── navitime/
│       │       │   ├── route/
│       │       │   └── transport/
│       │       ├── publicBathroom/
│       │       └── jorudan/           # ARCHIVED — type definitions only, not used
│       ├── wrangler.toml
│       └── package.json
│
└── functions/
    └── api/
        └── [[path]].ts                # Cloudflare Functions (edge middleware)
```

---

## Naming Conventions

### Files

- Domain-scoped utilities: `util.{domain}.ts` (e.g., `util.bookmark.ts`, `util.transit.ts`)
- Domain-scoped types: `type.{domain}.ts` (e.g., `type.bookmark.ts`, `type.settings.ts`)
- Root-level per package: `constant.ts`, `type.ts`, `validator.ts`, `util.ts`
- Pages: `kebab-case.astro` (e.g., `year-converter.astro`, `place-detail.astro`)

### Directories

- **Singular** everywhere: `route/`, `lib/`, `layout/`, `style/`, `external/`
- Provider dirs under `external/`: camelCase (e.g., `googleMap/`, `publicBathroom/`, `navitime/`)

### TypeScript

- **Abstract static classes** for grouping constants/utils: `AppUtil`, `BookmarkUtil`, `ShareConstant`, `WorkerUtil`
  - Constants: `public static readonly` + `SCREAMING_SNAKE_CASE`
  - Methods: `public static` + `camelCase`
- **Interfaces**: PascalCase (`NewsItem`, `PlaceItem`, `TransitRoute`, `PageMeta`)
- **Enums**: PascalCase name, `SCREAMING_SNAKE_CASE` keys (`HttpRequestMethod`, `TimeFormat`)
- No `any` — use `unknown` when genuinely unknown
- Explicit types everywhere (params, returns, generics)

### CSS Classes

BEM-inspired kebab-case:

- Block: `.news-item`, `.search-form`, `.place-details`
- Element: `.news-item__title`, `.news-item__meta`
- Modifier: `.place-details__status--open`, `.news-item__status--cached`

### URLs & Routes

- Page URLs: kebab-case, defined as constants in `ShareConstant` (`PAGE_URL_HOME`, `PAGE_URL_NEWS`, …)
- API routes: `/api/{feature}` or `/api/{feature}/{sub}`, query string params

---

## Features & Pages

| Feature    | Page Route                                               | API Route(s)                                                    | Provider                      | Status |
| ---------- | -------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------- | ------ |
| News       | `/news`                                                  | `GET /api/news`                                                 | NHK + BBC RSS                 | ✓ Done |
| Places     | `/place`, `/place/nearby`, `/place/detail`               | `GET /api/place/search\|nearby\|detail\|autocomplete`           | Google Maps via RapidAPI      | ✓ Done |
| Search     | `/search`                                                | `GET /api/search`                                               | DuckDuckGo via RapidAPI       | ✓ Done |
| Transit    | `/transit`                                               | `GET /api/transit`, `/api/transit/search\|around\|autocomplete` | Navitime via RapidAPI         | ✓ Done |
| Bathroom   | `/bathroom`                                              | `GET /api/bathroom/nearby`                                      | Public Bathrooms via RapidAPI | ✓ Done |
| Converters | `/converter/year-converter`, `/converter/area-converter` | — (client-side only)                                            | —                             | ✓ Done |
| Bookmark   | `/bookmark`                                              | — (localStorage)                                                | —                             | ✓ Done |
| Settings   | `/settings`                                              | — (localStorage)                                                | —                             | ✓ Done |

---

## External APIs (all via RapidAPI)

**Single secret:** `RAPIDAPI_KEY` (CF Workers secret) is used for all providers.

| Provider              | RapidAPI Host                             | Used For                                   |
| --------------------- | ----------------------------------------- | ------------------------------------------ |
| Google Maps Places v2 | `google-map-places-new-v2.p.rapidapi.com` | Place search, nearby, detail, autocomplete |
| DuckDuckGo            | `duckduckgo8.p.rapidapi.com`              | Text search                                |
| Navitime Route        | `navitime-route-totalnavi.p.rapidapi.com` | Transit route planning                     |
| Navitime Transport    | `navitime-transport.p.rapidapi.com`       | Station search/autocomplete/nearby         |
| Public Bathrooms      | `public-bathrooms.p.rapidapi.com`         | Bathroom finder                            |

Each provider's config (base URL, host header, TTL, limits) lives in `workers/api/src/external/{provider}/constant.ts`.

**Note on header casing:** Transit uses `X-RapidAPI-Key` (PascalCase); search and bathroom use `x-rapidapi-key` (lowercase). Match the existing style in each provider's file.

**Jorudan** (`external/jorudan/`): archived type definitions only. API key was never obtained; do not use or reference in new code.

---

## Caching Strategy

CF Cache API only (KV bindings are present in `wrangler.toml` but commented out).

```txt
Request hits Worker
  │
  └─ Check CF Cache API (in-memory, per edge node)
        Hit → return immediately (< 1ms)
        Miss → fetch external API → strip → store in Cache API → return
```

| Feature        | Cache TTL |
| -------------- | --------- |
| News           | 15 min    |
| Place search   | 30 min    |
| Place details  | 24 hours  |
| Search (DDG)   | 1 hour    |
| Transit route  | 1 hour    |
| Transit nodes  | 24 hours  |
| Bathrooms      | 30 min    |
| Real-time data | No cache  |

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

## Environment Variables

```txt
# CF Workers secret (set via wrangler secret put)
RAPIDAPI_KEY=...

# Set in wrangler.toml [vars] — dev only
ALLOWED_ORIGIN_DEV=http://localhost:4321
```

Do not add `GOOGLE_PLACES_API_KEY` or per-provider keys — everything goes through `RAPIDAPI_KEY`.

---

## Build & Dev Commands

```bash
# Install dependencies (workspace root)
bun install

# Dev: frontend (localhost:4321)
bun run dev:web

# Dev: worker (localhost:8787)
bun run dev:worker

# Type checking
bun run type:web       # apps/web
bun run type:worker    # workers/api
bun run type:share     # packages/share
bun run type:sw        # apps/web/src/sw.ts (WebWorker lib)

# Build & deploy
bun run build:web      # bun build sw.ts (IIFE) + astro build
bun run deploy:web     # astro build + wrangler pages deploy
bun run deploy:worker  # wrangler deploy
```

**Always use Bun. Never use npm or yarn.**

---

## Phase Plan

| Phase | Status | Scope                                                              |
| ----- | ------ | ------------------------------------------------------------------ |
| **1** | ✓ Done | Astro shell + CF Worker + RSS news reader (NHK + BBC)              |
| **2** | ✓ Done | Google Maps Places proxy (location search + ratings)               |
| **3** | ✓ Done | Japan transit lookup via Navitime (route + station search)         |
| **4** | ✓ Done | PWA: vanilla service worker, offline shell, last-content cache     |
| **5** | ✓ Done | Text search via DuckDuckGo                                         |
| **6** | ✓ Done | SW cache transparency: `X-Cache-Date` header, "Cached at HH:mm" UI |
| **7** | ✓ Done | Apple Maps links in Places (`lat`/`lng` → `maps.apple.com` URL)    |

---

## Design Constraints

- **No CSS frameworks** (no Tailwind, no Bootstrap)
- **No images** on data pages
- **No web fonts** — system font stack only: `system-ui, sans-serif`
- **No client-side tracking** or analytics scripts
- **No cookies** unless strictly necessary
- JS on the frontend = **progressive enhancement only** — pages must be readable without JS
- All API calls go through the Worker — **never call external APIs directly from the browser**

---

## Notes for Claude Code

- **RSS parsing**: Use the existing pure-regex parser in `workers/api/src/lib/rss.ts` (`extractTag`, `extractLinkUrl`, `stripCdata`). Never use `DOMParser` — the worker tsconfig uses `lib: ["ES2022"]` with no `"DOM"`, and adding DOM lib causes conflicts with `@cloudflare/workers-types`.
- **Worker tsconfig**: `lib: ["ES2022"]` only. Do not add `"DOM"` or `"WebWorker"` to the worker tsconfig.
- **Package manager**: Bun everywhere — `bun install`, `bun run <script>`.
- **Shared package**: `packages/share` (`@slim-portal/share`, `workspace:*`) is the canonical location for cross-environment types, validators, and constants. Both `apps/web` and `workers/api` import from it.
- **Worker router**: Uses URL pattern matching — no framework. Only add Hono if routing becomes significantly more complex.
- **KV cache**: Bindings are commented out in `wrangler.toml`. Do not enable unless explicitly building the KV caching layer.
- **Jorudan**: `external/jorudan/` is archived type definitions only. API key was never obtained; do not reference in new code.
- **Local testing**: Run `bun run dev:worker` to test Workers before deploying — wrangler dev accurately emulates the CF runtime including Cache API.
