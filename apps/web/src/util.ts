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
}
