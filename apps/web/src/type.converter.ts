/* eslint-disable perfectionist/sort-enums */
export enum JapaneseEra {
  Meiji = "Meiji",
  Taisho = "Taisho",
  Showa = "Showa",
  Heisei = "Heisei",
  Reiwa = "Reiwa",
}

export interface EraData {
  end: null | number;
  jaName: string;
  start: number;
}

export interface Era extends EraData {
  name: JapaneseEra;
}
