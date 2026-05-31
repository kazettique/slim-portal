# Local Dev HTTPS for PWA Testing on iPhone

iOS Safari requires HTTPS for PWA standalone mode. `http://localhost:4321` triggers
"navigation failed because the request was for an http url with https-only enabled"
when opened as a PWA from the home screen. Three options:

---

## Option A — Cloudflare Tunnel (fastest, zero setup)

```bash
cloudflared tunnel --url http://localhost:4321
```

Gets a `https://*.trycloudflare.com` URL instantly. No account needed.
Open that URL on iPhone → Add to Home Screen → done.

---

## Option B — ngrok

```bash
ngrok http 4321
```

Gets a `https://*.ngrok-free.app` URL. Free tier shows a browser interstitial on
first visit (click through once, then it works normally as a PWA).

---

## Option C — Local HTTPS with mkcert (cleanest for ongoing dev)

1. Install mkcert and create a local root CA:

   ```bash
   brew install mkcert
   mkcert -install
   ```

2. Generate a cert for localhost:

   ```bash
   mkcert localhost
   # → localhost.pem + localhost-key.pem
   ```

3. Add HTTPS to the Astro dev server (`apps/web/astro.config.mjs`):

   ```js
   server: {
     https: {
       key: './localhost-key.pem',
       cert: './localhost.pem',
     },
   },
   ```

4. Trust the mkcert root CA on iPhone:
   - Email/AirDrop `~/.local/share/mkcert/rootCA.pem` to the iPhone
   - Open it in Files → Install profile → Settings → General → About →
     Certificate Trust Settings → enable full trust for the mkcert CA

Then `bun run dev:web` serves on `https://localhost:4321`.
Find the machine's local IP via `ifconfig` and open `https://192.168.x.x:4321`
from the iPhone (same Wi-Fi required).

---

## Recommendation

- One-off test → **Option A** (cloudflared, 10 seconds to set up)
- Regular iPhone dev → **Option C** (mkcert, once set up it just works)
