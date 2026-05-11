export enum JErrorCode {
  SUCCESS = 0, // 成功
  INIT_FAILED = 1, // 初期化失敗
  CONFIG_LOAD_FAILED = 2, // 設定ファイル読込失敗
  INVALID_REQUEST = 3, // 不正なリクエスト
  ACCESS_KEY_MISMATCH = 4, // アクセスキー不一致
  TRANSIT_SERVER_CONNECT_FAILED = 5, // 乗換案内サーバー接続失敗
  TRANSIT_SERVER_DISCONNECT_FAILED = 6, // 乗換案内サーバー切断失敗
  SHUTDOWN_FAILED = 8, // 終了処理失敗
  API_PROCESSING_ERROR = 9, // API処理エラー
  ACCESS_NOT_PERMITTED = 10, // アクセス許可対象外
  REQUEST_LIMIT_EXCEEDED = 11, // リクエスト数上限エラー

  STATION_SEARCH_INIT_ERROR = 200, // 駅名検索 初期化エラー
  STATION_SEARCH_CONDITION_FAILED = 201, // 駅名検索 処理条件設定失敗
  STATION_SEARCH_FAILED = 202, // 駅名検索 検索失敗

  LINE_SEARCH_INIT_ERROR = 300, // 路線名検索 初期化エラー
  LINE_SEARCH_CONDITION_FAILED = 301, // 路線名検索 処理条件設定失敗
  LINE_SEARCH_FAILED = 302, // 路線名検索 検索失敗

  STATION_GET_INIT_ERROR = 400, // 駅取得 初期化エラー
  STATION_GET_CONDITION_FAILED = 401, // 駅取得 処理条件設定失敗
  STATION_GET_FAILED = 402, // 駅取得 処理失敗

  LINE_GET_INIT_ERROR = 500, // 路線取得 初期化エラー
  LINE_GET_CONDITION_FAILED = 501, // 路線取得 処理条件設定失敗
  LINE_GET_FAILED = 502, // 路線取得 処理失敗

  ROUTE_SEARCH_INIT_ERROR = 2400, // 経路検索 初期化エラー
  ROUTE_SEARCH_CONDITION_FAILED = 2401, // 経路検索 処理条件設定失敗
  ROUTE_SEARCH_FAILED = 2402, // 経路検索 経路検索失敗
  ROUTE_SEARCH_SAVE_FAILED = 2403, // 経路検索 経路情報保存失敗
  ROUTE_SEARCH_INSUFFICIENT_STATIONS = 2404, // 経路検索 駅不足
  ROUTE_SEARCH_DATE_TIME_ERROR = 2405, // 経路検索 日時指定エラー
  ROUTE_SEARCH_FAILED_2 = 2406, // 経路検索 経路検索失敗

  ROUTE_SEARCH_2_INIT_ERROR = 3400, // 経路検索 初期化エラー
  ROUTE_SEARCH_2_CONDITION_FAILED = 3401, // 経路検索 処理条件設定失敗
  ROUTE_SEARCH_2_FAILED = 3402, // 経路検索 経路検索失敗
  ROUTE_SEARCH_2_SAVE_FAILED = 3403, // 経路検索 経路情報保存失敗
  ROUTE_SEARCH_2_INSUFFICIENT_STATIONS = 3404, // 経路検索 駅不足
  ROUTE_SEARCH_2_DATE_TIME_ERROR = 3405, // 経路検索 日時指定エラー
  ROUTE_SEARCH_2_FAILED_2 = 3406, // 経路検索 経路検索失敗
}

// 検索モード
export enum SearchMode {
  DEFAULT = 0, // 前方一致検索(デフォルト)
  FULL_MATCH = 1, // 完全一致優先検索
}

// 乗換候補・リクエストの交通機関種別
export enum TransitMode {
  RAIL = "R", // 鉄道
  AIRPORT_BUS = "P", // 空港連絡バス
  HIGHWAY_BUS = "H", // 高速バス
  FERRY = "F", // フェリー
  BUS = "B", // 路線バス
}

// 路線の種別区分
export enum LineKubun {
  RAIL = "-", // 在来線
  AIRPLANE = "A", // 飛行機
  BUS = "B", // バス
  CAR = "C", // 自動車
  EXPRESS_TRAIN = "E", // 有料特急
  FERRY = "F", // 船
  TRAM = "K", // 路面電車
  LINER = "L", // ライナー
  PREMIUM_EXPRESS = "Q", // 有料急行列車
  SHINKANSEN = "S", // 新幹線
  WALK = "W", // 徒歩
}

export enum Diagram {
  UNSCHEDULED = 0, // 時刻表データなし
  SCHEDULED = 1, // 時刻表データあり
}

export enum ObtainMode {
  DEFAULT = 0, // 通常モード(デフォルト)
  EXCLUDE_IDENTICAL = 1, // 同一駅扱いされている駅の情報を除外
}

export enum IsIncluded {
  EXCLUDED = 0, // 含まない
  INCLUDED = 1, // 含む
}

// 路線種別
export enum RosenSyubetu {
  JR_LOCAL = 0, // JR在来線
  PRIVATE_LOCAL = 1, // 私鉄在来線
  SUBWAY = 2, // 地下鉄
  TRAM = 3, // 路面電車
  WALK = 4, // 徒歩
  BUS = 5, // バス
  AIRPLANE = 6, // 飛行機
  FERRY = 7, // 船
  EXPRESS_TRAIN = 8, // 有料特急列車
  SHINKANSEN = 9, // 新幹線
  SLEEPER_TRAIN = 10, // 寝台列車
  PREMIUM_EXPRESS = 11, // 有料急行列車
  HIGHWAY_BUS = 12, // 高速バス
  CAR = 13, // 自動車
  AIRPORT_BUS = 14, // 空港連絡バス
}

// 乗換有無
export enum Norikae {
  NO = 0, // 無し(直通など)
  YES = 1, // 乗換あり
}

// 往復割引の適用
export enum UntinOufuku {
  ONEWAY = 0, // 片道運賃
  ROUNDTRIP = 1, // 往復割引の片道分運賃
}

// 学生割引有無(0固定)
export enum UntinGakusei {
  NONE = 0, // 学生割引なし
}

// 季節料金区分
export enum TokkyuKisetu {
  NONE = -1, // 無し
  NORMAL = 0, // 通常期
  BUSY = 1, // 繁忙期
}

// 特急乗継割引有無
export enum TokkyuWaribiki {
  NONE = 0, // 無し
  DISCOUNT = 1, // 乗継割引あり
}

// 時刻タイプ
export enum TimeType {
  PASS_THROUGH = -2, // 通過
  NOT_IN_SERVICE = -1, // 非運行
  CONFIRM = 0, // 確定時刻
  ESTIMATED = 1, // 推定時刻
  TEMPORARY = 2, // 仮時刻 ※時刻表がない場合に平均所要時間を加算したもの
}

export enum LineColorType {
  NORMAL = 0, // 通常
  YOKOJIMA = 1, // 横じま
}

// 路線の時刻表有無
export enum HaveDiagram {
  NO = 0, // 時刻表が存在しない
  YES = 1, // 時刻表が存在
}

// 結果の時刻表適用
export enum UseDiagram {
  NO = 0, // 時刻表適用なし
  YES = 1, // 時刻表適用
}

// IC運賃有無
export enum IcSupport {
  NOT_SUPPORTED = 0, // IC運賃なし
  SUPPORTED = 1, // IC運賃あり
}

// 最も所要時間が短いか / 最も乗り換え時間が短い
export enum Hayai {
  NO = 0, // 最短ではない
  YES = 1, // 最も短い
}

// 最も費用が安いか
export enum Yasui {
  NO = 0, // 最安ではない
  YES = 1, // 最も安い
}

// 最も乗換回数が少ない
export enum Raku {
  NO = 0, // 最小ではない
  YES = 1, // 最も少ない
}

// 結果に飛行機を含む
export enum Kuuro {
  EXCLUDED = 0, // 空路を含まない
  INCLUDED = 1, // 空路を含む
}

// 結果に寝台列車を含む
export enum Shindai {
  EXCLUDED = 0, // 寝台列車を含まない
  INCLUDED = 1, // 寝台列車を含む
}

// 結果に高速バスを含む
export enum Kousoku {
  EXCLUDED = 0, // 高速バスを含まない
  INCLUDED = 1, // 高速バスを含む
}

// ICカードを使用した際に異なる運賃があるか
export enum IcSpecialPrice {
  NO = 0, // ICカード運賃なし
  YES = 1, // ICカード運賃あり
}

// CO2排出量が最も少ない
export enum CO2Emission {
  NOT_LOWEST = 0, // 最小ではない
  LOWEST = 1, // 最も少ない
}

// 検索種別
export enum Syubetu {
  NORMAL = 0, // 通常の検索結果
}

export interface StationCandidate {
  name: string; // 候補の名称
  company: string; // 会社名称
  kubun: TransitMode;
}

export interface Rosen {
  name: string; // 候補の名称
  company: string; // 会社名称 PS.無料版では「-(ハイフン)」のみが入ります
  kubun: LineKubun;
  diagram: Diagram;
}

// ger response rosen has no diagram field (unlike srn)
export interface RosenBase {
  name: string; // 路線の名称
  kubun: LineKubun;
}

// 駅の内容を示します
export interface LineStation {
  name: string; // 駅の名称
  kubun: TransitMode;
}

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
  untinTuusan: number; // 0: 金額なし, 1〜: 運賃ID, JorudanConstant.UNTIN_TUUSAN_TEIKI: 定期精算区間
  untinGakusei: UntinGakusei;
  tokkyu: number; // 特急料金等の追加料金
  tokkyuGreen: number; // 特急料金内のグリーン席分の金額
  tokkyuShindai: number; // 特急料金内の寝台分の金額
  tokkyuKisetu: TokkyuKisetu;
  tokkyuWaribiki: TokkyuWaribiki;
  tokkyuTuusan: number; // 0: 金額なし, 1〜: 追加料金ID
  icExist: IcSupport;
  icUntin: number; // IC運賃がない場合、切符と同じ金額
  icUntinTuusan: number; // 0: 金額なし, 1〜: 運賃ID, JorudanConstant.UNTIN_TUUSAN_TEIKI: 定期精算区間
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

// 路線色
export interface LineColor {
  type: LineColorType;
  num: number; // 路線色の数
  rgb: string[]; // RGB値 (16進数でRRGGBB, e.g. "ff5611")
}
