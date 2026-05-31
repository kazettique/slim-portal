import type { Era } from "./type.converter";

export abstract class AreaConverterUtil {
  // 1 坪 = 400/121 ㎡ (exact)
  public static readonly TSUBO_TO_SQM = 400 / 121;

  public static getTatamiM2(value: string): number {
    return parseFloat(value || "1.62");
  }

  public static round(n: number, decimals: number): string {
    return n.toFixed(decimals);
  }
}

export abstract class YearConverterUtil {
  public static readonly ERAS: Era[] = [
    { end: 1912, name: "明治", start: 1868 },
    { end: 1926, name: "大正", start: 1912 },
    { end: 1989, name: "昭和", start: 1926 },
    { end: 2019, name: "平成", start: 1989 },
    { end: null, name: "令和", start: 2019 },
  ];

  // Years where two eras overlap (transition years)
  public static readonly TRANSITION_YEARS: Record<number, string> = {
    1912: "明治45 or 大正1",
    1926: "大正15 or 昭和1",
    1989: "昭和64 or 平成1",
    2019: "平成31 or 令和1",
  };

  // Find the latest era that covers this year (for transition years, prefer the newer era)
  public static westernToEra(western: number): null | { era: Era; eraYear: number } {
    for (let i = YearConverterUtil.ERAS.length - 1; i >= 0; i--) {
      const era = YearConverterUtil.ERAS[i];
      if (western >= era.start && (era.end === null || western <= era.end)) {
        return { era, eraYear: western - era.start + 1 };
      }
    }
    return null;
  }
}
