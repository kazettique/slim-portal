import type {
  JErrorCode,
  LineStation,
  ObtainMode,
  Rosen,
  RosenBase,
  Route,
  SearchMode,
  StationCandidate,
  TransitMode,
} from "./type.common";

// 駅の接続路線取得(ger)
// http://example.co.jp/bizapi/ger
// Method: GET, querystring
export interface JGerRequest extends JRequestCommon {
  eki1: string;
  opt1?: ObtainMode;
}

export interface JGerResponse extends JResponseCommon<{
  num: number; // 結果の候補数
  rosen: RosenBase[];
}> {}

// 路線の所属駅取得(gre)
// http://example.co.jp/bizapi/gre
// Method: GET, querystring
export interface JGreRequest extends JRequestCommon {
  rsn: string;
}

export interface JGreResponse extends JResponseCommon<{
  eki: LineStation[];
  num: number; // 結果の駅数
}> {}

export interface JRequestCommon {
  ak: string; // アクセスキー
  rq?: string; // 指定した数値を結果のhead内にそのまま返却します。どのリクエストに対する結果かを判別する用途等でご使用ください。
}

export interface JResponseCommon<T extends Record<string, unknown>> {
  NorikaeBizApiResult: {
    body: T;
    head: {
      errorCode: JErrorCode;
      functionCode: string;
      rq: string; // 任意の数値 未指定時:0
    };
  };
}

// 駅名検索 (sen)
// http://example.co.jp/bizapi/sen
// Method: GET, querystring
export interface JSenRequest extends JRequestCommon {
  eki1: string; // 検索する文字列
  opt1?: SearchMode;
}

export interface JSenResponse extends JResponseCommon<{
  eki: StationCandidate[];
  num: number; // 結果の候補数
}> {}

// 路線名検索 (srn)
// http://example.co.jp/bizapi/srn
// Method: GET, querystring
export interface JSrnRequest extends JRequestCommon {
  opt1?: SearchMode; // 検索モード
  rsn: string; // 検索する文字列
}

export interface JSrnResponse extends JResponseCommon<{
  num: number; // 結果の候補数
  rosen: Rosen[];
}> {}

// 経路検索(sr)
// http://example.co.jp/bizapi/sr
// Method: GET, querystring
export interface JSrRequest extends JRequestCommon {
  date?: string; // 検索を行う年月日: yyyymmdd
  eki1: string; // 出発地(駅・バス停・港名など)を指定
  eki2: string; // 目的地(駅・バス停・港名など)を指定
  kbn1?: TransitMode; // 出発地(駅・バス停など)の区分
  kbn2?: TransitMode; // 目的地(駅・バス停など)の区分
}

export interface JSrResponse extends JResponseCommon<{
  jrdurl: string; // ジョルダン『乗換案内』へのリンク
  num: number; // 結果の経路数
  route: Route[];
  storeData: string; // 経路保存文字列(結果の再計算に利用)
}> {}
