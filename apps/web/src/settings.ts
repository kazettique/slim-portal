export enum TimeFormat {
  TWELVE_HOUR = "12h",
  TWENTY_FOUR_HOUR = "24h",
}

export interface NetworkEntry {
  page: NetworkPage;
  bytes: number;
  ts: string; // ISO 8601
}

export const MAX_LOG_ENTRIES = 500;

export enum NetworkPage {
  NEWS = "news",
  PLACES_SEARCH = "places/search",
  PLACES_NEARBY = "places/nearby",
  PLACES_DETAILS = "places/details",
  TRANSIT = "transit",
  SEARCH = "search",
}

export const NETWORK_PAGE_LABELS: Record<NetworkPage, string> = {
  [NetworkPage.NEWS]: "News",
  [NetworkPage.PLACES_SEARCH]: "Places – Search",
  [NetworkPage.PLACES_NEARBY]: "Places – Nearby",
  [NetworkPage.PLACES_DETAILS]: "Places – Details",
  [NetworkPage.TRANSIT]: "Transit",
  [NetworkPage.SEARCH]: "Search",
};

const LS_KEY_TIME_FORMAT = "setting:timeFormat";
const LS_KEY_NETWORK_USAGE = "setting:networkUsage";
const LS_KEY_CACHE_CLEARED_AT = "setting:cacheClearedAt";
const LS_KEY_NETWORK_SINCE = "setting:networkSince";
const LS_KEY_NETWORK_LOG = "setting:networkLog";
const LS_SETTING_KEYS = [
  LS_KEY_TIME_FORMAT,
  LS_KEY_NETWORK_USAGE,
  LS_KEY_CACHE_CLEARED_AT,
  LS_KEY_NETWORK_SINCE,
  LS_KEY_NETWORK_LOG,
] as const;

const DEFAULTS = {
  timeFormat: TimeFormat.TWENTY_FOUR_HOUR,
  networkUsage: {} as Record<string, number>,
} as const;

export abstract class AppSettings {
  // ── Time format ──────────────────────────────────────────────

  public static getTimeFormat(): TimeFormat {
    try {
      const stored = localStorage.getItem(LS_KEY_TIME_FORMAT);
      if (stored === TimeFormat.TWELVE_HOUR || stored === TimeFormat.TWENTY_FOUR_HOUR) return stored;
    } catch {
      // localStorage unavailable (private mode, etc.)
    }
    return DEFAULTS.timeFormat;
  }

  public static setTimeFormat(value: TimeFormat): void {
    try {
      localStorage.setItem(LS_KEY_TIME_FORMAT, value);
    } catch {
      // ignore
    }
  }

  // ── Network usage ─────────────────────────────────────────────

  public static getNetworkUsage(): Record<string, number> {
    try {
      const raw = localStorage.getItem(LS_KEY_NETWORK_USAGE);
      if (!raw) return { ...DEFAULTS.networkUsage };
      return JSON.parse(raw) as Record<string, number>;
    } catch {
      return { ...DEFAULTS.networkUsage };
    }
  }

  public static addNetworkBytes(page: NetworkPage, bytes: number): void {
    try {
      const now = new Date().toISOString();
      if (!localStorage.getItem(LS_KEY_NETWORK_SINCE)) {
        localStorage.setItem(LS_KEY_NETWORK_SINCE, now);
      }
      const usage = AppSettings.getNetworkUsage();
      usage[page] = (usage[page] ?? 0) + bytes;
      localStorage.setItem(LS_KEY_NETWORK_USAGE, JSON.stringify(usage));
      const log = AppSettings.getNetworkLog();
      log.push({ page, bytes, ts: now });
      if (log.length > MAX_LOG_ENTRIES) log.splice(0, log.length - MAX_LOG_ENTRIES);
      localStorage.setItem(LS_KEY_NETWORK_LOG, JSON.stringify(log));
    } catch {
      // ignore
    }
  }

  public static getNetworkLog(): NetworkEntry[] {
    try {
      const raw = localStorage.getItem(LS_KEY_NETWORK_LOG);
      if (!raw) return [];
      return JSON.parse(raw) as NetworkEntry[];
    } catch {
      return [];
    }
  }

  public static resetNetworkUsage(): void {
    try {
      localStorage.removeItem(LS_KEY_NETWORK_USAGE);
      localStorage.removeItem(LS_KEY_NETWORK_SINCE);
      localStorage.removeItem(LS_KEY_NETWORK_LOG);
    } catch {
      // ignore
    }
  }

  // ── Cache cleared timestamp ───────────────────────────────────

  public static getCacheClearedAt(): string | null {
    try {
      return localStorage.getItem(LS_KEY_CACHE_CLEARED_AT);
    } catch {
      return null;
    }
  }

  public static setCacheClearedAt(): void {
    try {
      localStorage.setItem(LS_KEY_CACHE_CLEARED_AT, new Date().toISOString());
    } catch {
      // ignore
    }
  }

  // ── Network since timestamp ───────────────────────────────────

  public static getNetworkSince(): string | null {
    try {
      return localStorage.getItem(LS_KEY_NETWORK_SINCE);
    } catch {
      return null;
    }
  }

  // ── Reset all ─────────────────────────────────────────────────

  public static resetAll(): void {
    try {
      for (const key of LS_SETTING_KEYS) {
        localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  }

  // ── Time conversion ───────────────────────────────────────────
  // Input:  "Monday: 9:00 AM – 6:00 PM"  (Google Places API, always 12h AM/PM)
  // Output (24h): "Monday: 09:00 – 18:00"
  // Output (12h): unchanged

  public static convertHoursString(raw: string, format: TimeFormat): string {
    if (format === TimeFormat.TWELVE_HOUR) return raw;
    return raw.replace(/(\d{1,2}):(\d{2})\s*(AM|PM)/gi, (_match, h, m, period) => {
      let hours = parseInt(h, 10);
      if (period.toUpperCase() === "AM") {
        if (hours === 12) hours = 0; // 12:xx AM → 00:xx (midnight)
      } else {
        if (hours !== 12) hours += 12; // x:xx PM (not noon) → +12
      }
      return `${String(hours).padStart(2, "0")}:${m}`;
    });
  }
}
