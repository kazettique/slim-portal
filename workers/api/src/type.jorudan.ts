export interface JRequestCommon {
  ak: string; // アクセスキー
  rq?: string; // 指定した数値を結果のhead内にそのまま返却します。どのリクエストに対する結果かを判別する用途等でご使用ください。
}

export interface JResponseCommon<T extends Record<string, unknown>> {
  NorikaeBizApiResult: {
    head: {
      functionCode: string;
      errorCode: JErrorCode;
      rq: string; // 任意の数値 未指定時:0
    };
    body: T;
  };
}

export enum JErrorCode {
  Success = 0, // 成功
  InitFailed = 1, // 初期化失敗
  ConfigLoadFailed = 2, // 設定ファイル読込失敗
  InvalidRequest = 3, // 不正なリクエスト
  AccessKeyMismatch = 4, // アクセスキー不一致
  TransitServerConnectFailed = 5, // 乗換案内サーバー接続失敗
  TransitServerDisconnectFailed = 6, // 乗換案内サーバー切断失敗
  ShutdownFailed = 8, // 終了処理失敗
  ApiProcessingError = 9, // API処理エラー
  AccessNotPermitted = 10, // アクセス許可対象外
  RequestLimitExceeded = 11, // リクエスト数上限エラー

  StationSearchInitError = 200, // 駅名検索 初期化エラー
  StationSearchConditionFailed = 201, // 駅名検索 処理条件設定失敗
  StationSearchFailed = 202, // 駅名検索 検索失敗

  LineSearchInitError = 300, // 路線名検索 初期化エラー
  LineSearchConditionFailed = 301, // 路線名検索 処理条件設定失敗
  LineSearchFailed = 302, // 路線名検索 検索失敗

  StationGetInitError = 400, // 駅取得 初期化エラー
  StationGetConditionFailed = 401, // 駅取得 処理条件設定失敗
  StationGetFailed = 402, // 駅取得 処理失敗

  LineGetInitError = 500, // 路線取得 初期化エラー
  LineGetConditionFailed = 501, // 路線取得 処理条件設定失敗
  LineGetFailed = 502, // 路線取得 処理失敗

  RouteSearchInitError = 2400, // 経路検索 初期化エラー
  RouteSearchConditionFailed = 2401, // 経路検索 処理条件設定失敗
  RouteSearchFailed = 2402, // 経路検索 経路検索失敗
  RouteSearchSaveFailed = 2403, // 経路検索 経路情報保存失敗
  RouteSearchInsufficientStations = 2404, // 経路検索 駅不足
  RouteSearchDateTimeError = 2405, // 経路検索 日時指定エラー
  RouteSearchFailed2 = 2406, // 経路検索 経路検索失敗

  RouteSearch2InitError = 3400, // 経路検索 初期化エラー
  RouteSearch2ConditionFailed = 3401, // 経路検索 処理条件設定失敗
  RouteSearch2Failed = 3402, // 経路検索 経路検索失敗
  RouteSearch2SaveFailed = 3403, // 経路検索 経路情報保存失敗
  RouteSearch2InsufficientStations = 3404, // 経路検索 駅不足
  RouteSearch2DateTimeError = 3405, // 経路検索 日時指定エラー
  RouteSearch2Failed2 = 3406, // 経路検索 経路検索失敗
}

// 駅名検索 (sen)
// http://example.co.jp/bizapi/sen
// Method: GET, querystring
export interface JSenRequest extends JRequestCommon {
  eki1: string; // 検索する文字列
  opt1?: SearchMode;
}

// 検索モード
export enum SearchMode {
  Default = 0, // 前方一致検索(デフォルト)
  FullMatch = 1, // 完全一致優先検索
}

export interface JSenResponse
  extends JResponseCommon<{
    num: number; // 結果の候補数
    eki: StationCandidate[];
  }> {}

export interface StationCandidate {
  name: string; // 候補の名称
  company: string; // 会社名称
  kubun: TransitMode;
}

// 乗換候補・リクエストの交通機関種別
export enum TransitMode {
  Rail = "R", // 鉄道
  AirportBus = "P", // 空港連絡バス
  HighwayBus = "H", // 高速バス
  Ferry = "F", // フェリー
  Bus = "B", // 路線バス
}

// 路線名検索 (srn)
// http://example.co.jp/bizapi/srn
// Method: GET, querystring
export interface JSrnRequest extends JRequestCommon {
  rsn: string; // 検索する文字列
  opt1?: SearchMode; // 検索モード
}

export interface JSrnResponse
  extends JResponseCommon<{
    num: number; // 結果の候補数
    rosen: Rosen[];
  }> {}

export interface Rosen {
  name: string; // 候補の名称
  company: string; // 会社名称 PS.無料版では「-(ハイフン)」のみが入ります
  kubun: LineKubun;
  diagram: Diagram;
}

// 路線の種別区分
export enum LineKubun {
  Rail = "-", // 在来線
  Airplane = "A", // 飛行機
  Bus = "B", // バス
  Car = "C", // 自動車
  ExpressTrain = "E", // 有料特急
  Ferry = "F", // 船
  Tram = "K", // 路面電車
  Liner = "L", // ライナー
  PremiumExpress = "Q", // 有料急行列車
  Shinkansen = "S", // 新幹線
  Walk = "W", // 徒歩
}

export enum Diagram {
  Unscheduled = 0, // 時刻表データなし
  Scheduled = 1, // 時刻表データあり
}

// 駅の接続路線取得(ger)
// http://example.co.jp/bizapi/ger
// Method: GET, querystring
export interface JGerRequest extends JRequestCommon {
  eki1: string;
  opt1?: ObtainMode;
}

export enum ObtainMode {
  Default = 0, // 通常モード(デフォルト)
  ExcludeIdentical = 1, // 同一駅扱いされている駅の情報を除外
}

// ger response rosen has no diagram field (unlike srn)
export interface RosenBase {
  name: string; // 路線の名称
  kubun: LineKubun;
}

export interface JGerResponse
  extends JResponseCommon<{
    num: number; // 結果の候補数
    rosen: RosenBase[];
  }> {}

// 路線の所属駅取得(gre)
// http://example.co.jp/bizapi/gre
// Method: GET, querystring
export interface JGreRequest extends JRequestCommon {
  rsn: string;
}

export interface JGreResponse
  extends JResponseCommon<{
    num: number; // 結果の駅数
    eki: LineStation[];
  }> {}

// 駅の内容を示します
export interface LineStation {
  name: string; // 駅の名称
  kubun: TransitMode;
}

// 経路検索(sr)
// http://example.co.jp/bizapi/sr
// Method: GET, querystring
export interface JSrRequest extends JRequestCommon {
  eki1: string; // 出発地(駅・バス停・港名など)を指定
  eki2: string; // 目的地(駅・バス停・港名など)を指定
  kbn1?: TransitMode; // 出発地(駅・バス停など)の区分
  kbn2?: TransitMode; // 目的地(駅・バス停など)の区分
  date?: string; // 検索を行う年月日: yyyymmdd
}

export interface JSrResponse
  extends JResponseCommon<{
    jrdurl: string; // ジョルダン『乗換案内』へのリンク
    num: number; // 結果の経路数
    storeData: string; // 経路保存文字列(結果の再計算に利用)
    route: Route[];
  }> {}

// 経路ごとの情報
export interface Route {
  id: number;
  hyouka: Hyouka;
}

// 経路の概要 (was incorrectly flattened onto Route)
export interface Hyouka {
  pathCnt: number; // 路線数
  jikan: number; // 経路の所要時間（分単位）
  hiyou: number; // 経路の費用
  icHiyou: number; // 経路の費用(IC)
  icExist: IcSupport;
  kyori: number; // 経路の距離, 100m単位, 無効な場合は負値
  norikaeCnt: number; // 乗換回数
  status: RouteStatus;
  kubun: RouteKubun;
  path: Path[];
}

// 経路の評価
export interface RouteStatus {
  hayai: Hayai; // 最も所要時間が短いか
  yasui: Yasui; // 最も費用が安いか
  raku: Raku; // 最も乗換回数が少ない
  kuuro: Kuuro; // 結果に飛行機を含む
  shindai: Shindai; // 結果に寝台列車を含む
  kousoku: Kousoku; // 結果に高速バスを含む
  icCard: IcSpecialPrice; // ICカードを使用した際に異なる運賃があるか
  norikae: Hayai; // 最も乗り換え時間が短い
  co2: CO2Emission; // CO2排出量が最も少ない
  syubetu: Syubetu; // 検索種別
  value: string; // statusの値一覧(「,」カンマ区切り)
}

// 経路の区分 (renamed from Kubun3)
export interface RouteKubun {
  shinkansen: IsIncluded; // 結果に新幹線を含む
  nozomi: IsIncluded; // 結果に新幹線のぞみを含む
  tokkyu: IsIncluded; // 結果に有料特急列車を含む
  shindai: IsIncluded; // 結果に寝台列車を含む
  kuuro: IsIncluded; // 結果に空路を含む
  bus: IsIncluded; // 結果に路線バスを含む
  kousoku: IsIncluded; // 結果に高速バスを含む
  renraku: IsIncluded; // 結果に連絡バスを含む
  shinya: IsIncluded; // 結果に深夜急行バスを含む
  ferry: IsIncluded; // 結果に航路を含む
  toho: IsIncluded; // 結果に徒歩を含む
  yuryou: IsIncluded; // 結果に有料普通列車を含む
  jr: IsIncluded; // 結果にJRを含む
  value: string; // kubunの値一覧(「,」カンマ区切り)
}

export enum IsIncluded {
  Excluded = 0, // 含まない
  Included = 1, // 含む
}

// 路線ごとの情報
export interface Path {
  id: number; // 路線の通し番号
  rosen: string; // 路線名
  rosenSyubetu: RosenSyubetu;
  from: string; // 出発地
  fromExt: string; // 出発地拡張情報
  to: string; // 到着地
  toExt: string; // 到着地拡張情報
  kyori: number; // 距離(100m単位)
  jikan: number; // 所要時間(分単位)
  norikae: Norikae;
  mati: number; // 乗換待ち時間(分単位)
  idou: number; // 移動時間(分単位)
  direction: number; // 進行方向
  seatName: string; // 座席名称
  seatCode: string; // 座席コード
  seatKubun: SeatKubun;
  untin: number; // 運賃
  untinOufuku: UntinOufuku;
  untinTuusan: number; // 0: 金額なし, 1〜: 運賃ID, JConstant.UNTIN_TUUSAN_TEIKI: 定期精算区間
  untinGakusei: UntinGakusei;
  tokkyu: number; // 特急料金等の追加料金
  tokkyuGreen: number; // 特急料金内のグリーン席分の金額
  tokkyuShindai: number; // 特急料金内の寝台分の金額
  tokkyuKisetu: TokkyuKisetu;
  tokkyuWaribiki: TokkyuWaribiki;
  tokkyuTuusan: number; // 0: 金額なし, 1〜: 追加料金ID
  icExist: IcSupport;
  icUntin: number; // IC運賃がない場合、切符と同じ金額
  icUntinTuusan: number; // 0: 金額なし, 1〜: 運賃ID, JConstant.UNTIN_TUUSAN_TEIKI: 定期精算区間
  icUntinGakusei: UntinGakusei;
  icTokkyu: number;
  icTokkyuGreen: number;
  icTokkyuTuusan: number; // 0: 金額なし, 1〜: 追加料金ID
  airLine: string; // 航空会社名
  fromDate: string; // 発年月日
  fromTime: string; // 発時刻
  fromTimeType: TimeType;
  toDate: string; // 着年月日
  toTime: string; // 着時刻
  toTimeType: TimeType;
  lineName: string; // 列車名
  lineIndex: number; // 列車識別子
  selectLine: string; // 列車番号 この値が同じ場合、同一列車となります
  lineType: string; // 列車種別
  lineColor: LineColor;
  haveDiagram: HaveDiagram;
  useDiagram: UseDiagram;
  rosenCorp: string; // 路線の会社略称
  busCorp: string; // バス会社名
  josyaText: string; // 乗車位置情報
  fromPlatform: string; // 発駅の番線
  toPlatform: string; // 着駅の番線
  tokurei: Tokurei;
  icTokurei: Tokurei; // IC特例情報
  co2: number; // CO2排出量(g単位)
  fromX: string; // 発駅の緯度 hour,minute,sec,msec
  fromY: string; // 発駅の経度 hour,minute,sec,msec
  toX: string; // 着駅の緯度 hour,minute,sec,msec
  toY: string; // 着駅の経度 hour,minute,sec,msec
}

// 路線種別
export enum RosenSyubetu {
  JrLocal = 0, // JR在来線
  PrivateLocal = 1, // 私鉄在来線
  Subway = 2, // 地下鉄
  Tram = 3, // 路面電車
  Walk = 4, // 徒歩
  Bus = 5, // バス
  Airplane = 6, // 飛行機
  Ferry = 7, // 船
  ExpressTrain = 8, // 有料特急列車
  Shinkansen = 9, // 新幹線
  SleeperTrain = 10, // 寝台列車
  PremiumExpress = 11, // 有料急行列車
  HighwayBus = 12, // 高速バス
  Car = 13, // 自動車
  AirportBus = 14, // 空港連絡バス
}

// 乗換有無
export enum Norikae {
  No = 0, // 無し(直通など)
  Yes = 1, // 乗換あり
}

// 変更可能な座席情報
export interface SeatKubun {
  num: number; // 変更可能な座席の数
  kubun?: SeatOption[]; // 変更可能な座席の区分 (absent when num is 0)
}

// 変更可能な座席の区分 (renamed from Kubun4)
export interface SeatOption {
  id: number; // 変更可能な座席の通し番号
  code: string; // 変更可能な座席の座席コード
  name: string; // 変更可能な座席の座席名称
  airLine: string; // 航空会社名(空路の場合)
  untin: number; // 金額(空路の場合)
}

// 特例情報の内容
export interface TokureiInfo {
  code: string; // 特例コード
  name: string; // 特例の名称
  text: string; // 特例の説明文
  id: number; // 特例の通し番号
}

// 特例情報
export interface Tokurei {
  data: number; // 特例データ番号
  num: number; // 特例の数
  info: TokureiInfo[];
}

// 往復割引の適用
export enum UntinOufuku {
  Oneway = 0, // 片道運賃
  Roundtrip = 1, // 往復割引の片道分運賃
}

// 学生割引有無(0固定)
export enum UntinGakusei {
  None = 0, // 学生割引なし
}

// 季節料金区分
export enum TokkyuKisetu {
  None = -1, // 無し
  Normal = 0, // 通常期
  Busy = 1, // 繁忙期
}

// 特急乗継割引有無
export enum TokkyuWaribiki {
  None = 0, // 無し
  Discount = 1, // 乗継割引あり
}

// 時刻タイプ
export enum TimeType {
  PassThrough = -2, // 通過
  NotInService = -1, // 非運行
  Confirm = 0, // 確定時刻
  Estimated = 1, // 推定時刻
  Temporary = 2, // 仮時刻 ※時刻表がない場合に平均所要時間を加算したもの
}

// 路線色
export interface LineColor {
  type: LineColorType;
  num: number; // 路線色の数
  rgb: string[]; // RGB値 (16進数でRRGGBB, e.g. "ff5611")
}

export enum LineColorType {
  Normal = 0, // 通常
  Yokojima = 1, // 横じま
}

// 路線の時刻表有無
export enum HaveDiagram {
  No = 0, // 時刻表が存在しない
  Yes = 1, // 時刻表が存在
}

// 結果の時刻表適用
export enum UseDiagram {
  No = 0, // 時刻表適用なし
  Yes = 1, // 時刻表適用
}

// IC運賃有無
export enum IcSupport {
  NotSupported = 0, // IC運賃なし
  Supported = 1, // IC運賃あり
}

// 最も所要時間が短いか / 最も乗り換え時間が短い
export enum Hayai {
  No = 0, // 最短ではない
  Yes = 1, // 最も短い
}

// 最も費用が安いか
export enum Yasui {
  No = 0, // 最安ではない
  Yes = 1, // 最も安い
}

// 最も乗換回数が少ない
export enum Raku {
  No = 0, // 最小ではない
  Yes = 1, // 最も少ない
}

// 結果に飛行機を含む
export enum Kuuro {
  Excluded = 0, // 空路を含まない
  Included = 1, // 空路を含む
}

// 結果に寝台列車を含む
export enum Shindai {
  Excluded = 0, // 寝台列車を含まない
  Included = 1, // 寝台列車を含む
}

// 結果に高速バスを含む
export enum Kousoku {
  Excluded = 0, // 高速バスを含まない
  Included = 1, // 高速バスを含む
}

// ICカードを使用した際に異なる運賃があるか
export enum IcSpecialPrice {
  No = 0, // ICカード運賃なし
  Yes = 1, // ICカード運賃あり
}

// CO2排出量が最も少ない
export enum CO2Emission {
  NotLowest = 0, // 最小ではない
  Lowest = 1, // 最も少ない
}

// 検索種別
export enum Syubetu {
  Normal = 0, // 通常の検索結果
}

// Named special values for open-ended numeric fields
export abstract class JConstant {
  // untinTuusan / icUntinTuusan: 0 = 金額なし, 84 = 定期精算区間, 1〜 = 運賃ID
  public static readonly UNTIN_TUUSAN_TEIKI: number = 84;

  // tokkyuTuusan / icTokkyuTuusan: 0 = 特急料金なし, 1〜 = 追加料金ID
  public static readonly TOKKYU_TUUSAN_NONE: number = 0;
}
