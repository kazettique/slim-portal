import type { TransitLeg } from "@slim-portal/share";

export abstract class TransitUtil {
  public static isWalkLeg(leg: TransitLeg): boolean {
    const l = leg.line.toLowerCase();
    return l === "walk" || l === "徒歩" || l === "walking";
  }
}
