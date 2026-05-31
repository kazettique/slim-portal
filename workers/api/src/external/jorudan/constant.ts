// Named special values for open-ended numeric fields
export abstract class JorudanConstant {
  // tokkyuTuusan / icTokkyuTuusan: 0 = 特急料金なし, 1〜 = 追加料金ID
  public static readonly TOKKYU_TUUSAN_NONE: number = 0;

  // untinTuusan / icUntinTuusan: 0 = 金額なし, 84 = 定期精算区間, 1〜 = 運賃ID
  public static readonly UNTIN_TUUSAN_TEIKI: number = 84;
}
