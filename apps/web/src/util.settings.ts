import type { NetworkEntry } from "./type.settings";

import { MenuPosition, MenuStyle, NetworkPage, TextSize, Theme, TimeFormat } from "./type.settings";

export abstract class SettingsUtil {
  // ── Public constants ──────────────────────────────────────────

  public static readonly MAX_LOG_ENTRIES = 500;
  public static readonly NETWORK_PAGE_LABELS: Record<NetworkPage, string> = {
    [NetworkPage.BATHROOM]: "Bathrooms – Nearby",
    [NetworkPage.NEWS]: "News",
    [NetworkPage.PLACE_DETAIL]: "Places – Details",
    [NetworkPage.PLACE_NEARBY]: "Places – Nearby",
    [NetworkPage.PLACE_SEARCH]: "Places – Search",
    [NetworkPage.SEARCH]: "Search",
    [NetworkPage.TRANSIT]: "Transit",
  };

  public static readonly PAGE_COLORS: Record<NetworkPage, string> = {
    [NetworkPage.BATHROOM]: "#78909c",
    [NetworkPage.NEWS]: "#0057b7",
    [NetworkPage.PLACE_DETAIL]: "#e67e22",
    [NetworkPage.PLACE_NEARBY]: "#6a5acd",
    [NetworkPage.PLACE_SEARCH]: "#2e8b57",
    [NetworkPage.SEARCH]: "#16a085",
    [NetworkPage.TRANSIT]: "#c0392b",
  };

  // ── Private LS keys ───────────────────────────────────────────

  private static readonly DEFAULTS = {
    menuPosition: MenuPosition.TOP,
    menuStyle: MenuStyle.BOTH,
    networkUsage: {} as Record<string, number>,
    textSize: TextSize.MEDIUM,
    theme: Theme.SYSTEM,
    timeFormat: TimeFormat.TWENTY_FOUR_HOUR,
  } as const;
  private static readonly LS_KEY_CACHE_CLEARED_AT = "setting:cacheClearedAt";
  private static readonly LS_KEY_MENU_POSITION = "setting:menuPosition";
  private static readonly LS_KEY_MENU_STYLE = "setting:menuStyle";
  private static readonly LS_KEY_NETWORK_LOG = "setting:networkLog";
  private static readonly LS_KEY_NETWORK_SINCE = "setting:networkSince";
  private static readonly LS_KEY_NETWORK_USAGE = "setting:networkUsage";
  private static readonly LS_KEY_TEXT_SIZE = "setting:textSize";
  private static readonly LS_KEY_THEME = "setting:theme";
  private static readonly LS_KEY_TIME_FORMAT = "setting:timeFormat";

  private static readonly LS_SETTING_KEYS = [
    SettingsUtil.LS_KEY_TIME_FORMAT,
    SettingsUtil.LS_KEY_NETWORK_USAGE,
    SettingsUtil.LS_KEY_CACHE_CLEARED_AT,
    SettingsUtil.LS_KEY_NETWORK_SINCE,
    SettingsUtil.LS_KEY_NETWORK_LOG,
    SettingsUtil.LS_KEY_THEME,
    SettingsUtil.LS_KEY_MENU_STYLE,
    SettingsUtil.LS_KEY_MENU_POSITION,
    SettingsUtil.LS_KEY_TEXT_SIZE,
  ] as const;

  // ── Time format ──────────────────────────────────────────────

  public static addNetworkBytes(page: NetworkPage, bytes: number): void {
    try {
      const now = new Date().toISOString();
      if (!localStorage.getItem(SettingsUtil.LS_KEY_NETWORK_SINCE)) {
        localStorage.setItem(SettingsUtil.LS_KEY_NETWORK_SINCE, now);
      }
      const usage = SettingsUtil.getNetworkUsage();
      usage[page] = (usage[page] ?? 0) + bytes;
      localStorage.setItem(SettingsUtil.LS_KEY_NETWORK_USAGE, JSON.stringify(usage));
      const log = SettingsUtil.getNetworkLog();
      log.push({ bytes, page, ts: now });
      if (log.length > SettingsUtil.MAX_LOG_ENTRIES)
        log.splice(0, log.length - SettingsUtil.MAX_LOG_ENTRIES);
      localStorage.setItem(SettingsUtil.LS_KEY_NETWORK_LOG, JSON.stringify(log));
    } catch {
      // ignore
    }
  }

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

  // ── Theme ─────────────────────────────────────────────────────

  public static getCacheClearedAt(): null | string {
    try {
      return localStorage.getItem(SettingsUtil.LS_KEY_CACHE_CLEARED_AT);
    } catch {
      return null;
    }
  }

  public static getMenuPosition(): MenuPosition {
    try {
      const stored = localStorage.getItem(SettingsUtil.LS_KEY_MENU_POSITION);
      if (stored === MenuPosition.TOP || stored === MenuPosition.BOTTOM) return stored;
    } catch {
      // localStorage unavailable (private mode, etc.)
    }
    return SettingsUtil.DEFAULTS.menuPosition;
  }

  // ── Menu style ────────────────────────────────────────────────

  public static getMenuStyle(): MenuStyle {
    try {
      const stored = localStorage.getItem(SettingsUtil.LS_KEY_MENU_STYLE);
      if (
        stored === MenuStyle.ICON_ONLY ||
        stored === MenuStyle.BOTH ||
        stored === MenuStyle.TEXT_ONLY
      )
        return stored;
    } catch {
      // localStorage unavailable (private mode, etc.)
    }
    return SettingsUtil.DEFAULTS.menuStyle;
  }

  public static getNetworkLog(): NetworkEntry[] {
    try {
      const raw = localStorage.getItem(SettingsUtil.LS_KEY_NETWORK_LOG);
      if (!raw) return [];
      return JSON.parse(raw) as NetworkEntry[];
    } catch {
      return [];
    }
  }

  // ── Menu position ─────────────────────────────────────────────

  public static getNetworkSince(): null | string {
    try {
      return localStorage.getItem(SettingsUtil.LS_KEY_NETWORK_SINCE);
    } catch {
      return null;
    }
  }

  public static getNetworkUsage(): Record<string, number> {
    try {
      const raw = localStorage.getItem(SettingsUtil.LS_KEY_NETWORK_USAGE);
      if (!raw) return { ...SettingsUtil.DEFAULTS.networkUsage };
      return JSON.parse(raw) as Record<string, number>;
    } catch {
      return { ...SettingsUtil.DEFAULTS.networkUsage };
    }
  }

  // ── Text size ─────────────────────────────────────────────────

  public static getTextSize(): TextSize {
    try {
      const stored = localStorage.getItem(SettingsUtil.LS_KEY_TEXT_SIZE);
      if (
        stored === TextSize.SMALL ||
        stored === TextSize.MEDIUM ||
        stored === TextSize.LARGE ||
        stored === TextSize.EXTRA_LARGE
      )
        return stored;
    } catch {
      // localStorage unavailable (private mode, etc.)
    }
    return SettingsUtil.DEFAULTS.textSize;
  }

  public static getTheme(): Theme {
    try {
      const stored = localStorage.getItem(SettingsUtil.LS_KEY_THEME);
      if (stored === Theme.LIGHT || stored === Theme.DARK || stored === Theme.SYSTEM) return stored;
    } catch {
      // localStorage unavailable (private mode, etc.)
    }
    return SettingsUtil.DEFAULTS.theme;
  }

  // ── Network usage ─────────────────────────────────────────────

  public static getTimeFormat(): TimeFormat {
    try {
      const stored = localStorage.getItem(SettingsUtil.LS_KEY_TIME_FORMAT);
      if (stored === TimeFormat.TWELVE_HOUR || stored === TimeFormat.TWENTY_FOUR_HOUR)
        return stored;
    } catch {
      // localStorage unavailable (private mode, etc.)
    }
    return SettingsUtil.DEFAULTS.timeFormat;
  }

  public static resetAll(): void {
    try {
      for (const key of SettingsUtil.LS_SETTING_KEYS) {
        localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  }

  public static resetNetworkUsage(): void {
    try {
      localStorage.removeItem(SettingsUtil.LS_KEY_NETWORK_USAGE);
      localStorage.removeItem(SettingsUtil.LS_KEY_NETWORK_SINCE);
      localStorage.removeItem(SettingsUtil.LS_KEY_NETWORK_LOG);
    } catch {
      // ignore
    }
  }

  public static setCacheClearedAt(): void {
    try {
      localStorage.setItem(SettingsUtil.LS_KEY_CACHE_CLEARED_AT, new Date().toISOString());
    } catch {
      // ignore
    }
  }

  // ── Cache cleared timestamp ───────────────────────────────────

  public static setMenuPosition(value: MenuPosition): void {
    try {
      localStorage.setItem(SettingsUtil.LS_KEY_MENU_POSITION, value);
    } catch {
      // ignore
    }
  }

  public static setMenuStyle(value: MenuStyle): void {
    try {
      localStorage.setItem(SettingsUtil.LS_KEY_MENU_STYLE, value);
    } catch {
      // ignore
    }
  }

  // ── Network since timestamp ───────────────────────────────────

  public static setTextSize(value: TextSize): void {
    try {
      localStorage.setItem(SettingsUtil.LS_KEY_TEXT_SIZE, value);
    } catch {
      // ignore
    }
  }

  // ── Reset all ─────────────────────────────────────────────────

  public static setTheme(value: Theme): void {
    try {
      localStorage.setItem(SettingsUtil.LS_KEY_THEME, value);
    } catch {
      // ignore
    }
  }

  // ── Time conversion ───────────────────────────────────────────
  // Input:  "Monday: 9:00 AM – 6:00 PM"  (Google Places API, always 12h AM/PM)
  // Output (24h): "Monday: 09:00 – 18:00"
  // Output (12h): unchanged

  public static setTimeFormat(value: TimeFormat): void {
    try {
      localStorage.setItem(SettingsUtil.LS_KEY_TIME_FORMAT, value);
    } catch {
      // ignore
    }
  }
}
