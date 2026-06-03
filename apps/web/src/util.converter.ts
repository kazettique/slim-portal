import { type Era, type EraData, JapaneseEra } from "./type.converter";

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
  public static readonly ERAS: Record<JapaneseEra, EraData> = {
    [JapaneseEra.Meiji]: { end: 1912, jaName: "明治", start: 1868 },
    [JapaneseEra.Taisho]: { end: 1926, jaName: "大正", start: 1912 },
    // eslint-disable-next-line perfectionist/sort-objects
    [JapaneseEra.Showa]: { end: 1989, jaName: "昭和", start: 1926 },
    // eslint-disable-next-line perfectionist/sort-objects
    [JapaneseEra.Heisei]: { end: 2019, jaName: "平成", start: 1989 },
    [JapaneseEra.Reiwa]: { end: null, jaName: "令和", start: 2019 },
  };

  public static readonly ERA_OPTIONS: { label: string; value: JapaneseEra }[] = Object.entries(
    this.ERAS,
  ).map(([name, era]) => ({
    label: `${name} (${era.jaName})`,
    value: name as JapaneseEra,
  }));

  public static readonly ROC_OFFSET: number = 1911;
  public static readonly ROC_START: number = 1912;

  // Years where two eras overlap (transition years)
  public static readonly TRANSITION_YEARS: Record<number, string> = Object.entries(
    this.ERAS,
  ).reduce<Record<number, string>>((acc, [currKey, currVal], i, arr) => {
    if (i === 0) return acc;
    const [prevKey, prevVal] = arr[i - 1];
    const n = currVal.start - prevVal.start + 1;
    acc[currVal.start] = `${prevKey} (${prevVal.jaName}) ${n} or ${currKey} (${currVal.jaName}) 1`;
    return acc;
  }, {});

  // Find the latest era that covers this year (for transition years, prefer the newer era)
  public static westernToEra(western: number): null | { era: Era; eraYear: number } {
    const entries = Object.entries(YearConverterUtil.ERAS) as [JapaneseEra, EraData][];
    for (const [name, eraData] of [...entries].reverse()) {
      if (western >= eraData.start && (eraData.end === null || western <= eraData.end)) {
        return { era: { ...eraData, name }, eraYear: western - eraData.start + 1 };
      }
    }
    return null;
  }
}
