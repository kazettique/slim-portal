import { AppConstant } from "./constant";
import { TimeFormat } from "./type.settings";

export abstract class AppUtil {
  public static getPageTitle(title: string): string {
    return [title, AppConstant.APP_TITLE].join(" - ");
  }

  public static formatDate(iso: string, format: TimeFormat = TimeFormat.TWENTY_FOUR_HOUR): string {
    try {
      return new Date(iso).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: format === TimeFormat.TWELVE_HOUR,
      });
    } catch {
      return iso;
    }
  }

  public static formatDistance(meters: number | null): string {
    if (meters === null) return "";
    if (meters < 1000) return ` · ${meters}m`;
    return ` · ${(meters / 1000).toFixed(1)}km`;
  }

  public static formatRating(rating: number | null, total: number): string {
    if (rating === null) return "No rating";
    return `★ ${rating.toFixed(1)} · ${total.toLocaleString()} reviews`;
  }

  public static formatCacheTime(isoTs: string, format: TimeFormat = TimeFormat.TWENTY_FOUR_HOUR): string {
    const d = new Date(isoTs);
    const mm = String(d.getMinutes()).padStart(2, "0");
    if (format === TimeFormat.TWELVE_HOUR) {
      const h = d.getHours();
      return `Cached at ${h % 12 || 12}:${mm} ${h >= 12 ? "PM" : "AM"}`;
    }
    return `Cached at ${String(d.getHours()).padStart(2, "0")}:${mm}`;
  }

  public static formatDistanceKm(km: number): string {
    return km < 1 ? ` · ${km.toFixed(2)} km` : ` · ${km.toFixed(1)} km`;
  }

  public static formatKb(bytes: number): string {
    if (bytes === 0) return "0 KB";
    const kb = bytes / 1024;
    return kb < 1000 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(2)} MB`;
  }

  public static toDatetimeLocalValue(date: Date): string {
    const pad = (n: number): string => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  public static statusClass(status: string | null): string {
    if (!status) return "place-details__status";
    const lower = status.toLowerCase();
    if (lower.includes("operational") || lower.includes("open")) return "place-details__status place-details__status--open";
    if (lower.includes("closed") || lower.includes("temporarily")) return "place-details__status place-details__status--closed";
    return "place-details__status";
  }
}
