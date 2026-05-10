import { AppConstant } from "./constant";

export abstract class AppUtil {
  public static getPageTitle(title: string): string {
    return [title, AppConstant.APP_TITLE].join(" - ");
  }

  public static formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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

  public static formatCacheTime(isoTs: string): string {
    const d = new Date(isoTs);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `Cached at ${hh}:${mm}`;
  }
}
