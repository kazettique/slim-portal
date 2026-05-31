import { z } from "zod/v4";

import type {
  JGerRequest,
  JGerResponse,
  JGreRequest,
  JGreResponse,
  JResponseCommon,
  JSenRequest,
  JSenResponse,
  JSrnRequest,
  JSrnResponse,
  JSrRequest,
  JSrResponse,
} from "./type";
import type {
  Hyouka,
  LineColor,
  LineStation,
  Path,
  Rosen,
  RosenBase,
  Route,
  RouteKubun,
  RouteStatus,
  SeatKubun,
  SeatOption,
  StationCandidate,
  Tokurei,
  TokureiInfo,
} from "./type.common";

import {
  CO2Emission,
  Diagram,
  HaveDiagram,
  Hayai,
  IcSpecialPrice,
  IcSupport,
  IsIncluded,
  JErrorCode,
  Kousoku,
  Kuuro,
  LineColorType,
  LineKubun,
  Norikae,
  ObtainMode,
  Raku,
  RosenSyubetu,
  SearchMode,
  Shindai,
  Syubetu,
  TimeType,
  TokkyuKisetu,
  TokkyuWaribiki,
  TransitMode,
  UntinGakusei,
  UntinOufuku,
  UseDiagram,
  Yasui,
} from "./type.common";

export abstract class JorudanValidator {
  // --- common base (used for .extend() on request validators) ---
  private static readonly J_REQUEST_COMMON = z.object({
    ak: z.string(),
    rq: z.string().optional(),
  });
  private static readonly OBTAIN_MODE_VALIDATOR: z.ZodType<ObtainMode> = z.enum(ObtainMode);
  // --- 駅の接続路線取得 (ger) ---
  public static readonly GER_REQUEST_VALIDATOR: z.ZodType<JGerRequest> =
    JorudanValidator.J_REQUEST_COMMON.extend({
      eki1: z.string(),
      opt1: JorudanValidator.OBTAIN_MODE_VALIDATOR.optional(),
    });
  private static readonly LINE_KUBUN_VALIDATOR: z.ZodType<LineKubun> = z.enum(LineKubun);
  private static readonly ROSEN_BASE_VALIDATOR: z.ZodType<RosenBase> = z.object({
    kubun: JorudanValidator.LINE_KUBUN_VALIDATOR,
    name: z.string(),
  });

  public static readonly GER_RESPONSE_VALIDATOR: z.ZodType<JGerResponse> =
    JorudanValidator.responseValidator(
      z.object({
        num: z.coerce.number(),
        rosen: JorudanValidator.ROSEN_BASE_VALIDATOR.array(),
      }),
    ) as z.ZodType<JGerResponse>;
  // --- 路線の所属駅取得 (gre) ---
  public static readonly GRE_REQUEST_VALIDATOR: z.ZodType<JGreRequest> =
    JorudanValidator.J_REQUEST_COMMON.extend({
      rsn: z.string(),
    });
  private static readonly TRANSIT_MODE_VALIDATOR: z.ZodType<TransitMode> = z.enum(TransitMode);
  private static readonly LINE_STATION_VALIDATOR: z.ZodType<LineStation> = z.object({
    kubun: JorudanValidator.TRANSIT_MODE_VALIDATOR,
    name: z.string(),
  });
  public static readonly GRE_RESPONSE_VALIDATOR: z.ZodType<JGreResponse> =
    JorudanValidator.responseValidator(
      z.object({
        eki: JorudanValidator.LINE_STATION_VALIDATOR.array(),
        num: z.coerce.number(),
      }),
    ) as z.ZodType<JGreResponse>;
  // --- string-value enum validators ---
  private static readonly SEARCH_MODE_VALIDATOR: z.ZodType<SearchMode> = z.enum(SearchMode);
  // --- 駅名検索 (sen) ---
  public static readonly SEN_REQUEST_VALIDATOR: z.ZodType<JSenRequest> =
    JorudanValidator.J_REQUEST_COMMON.extend({
      eki1: z.string(),
      opt1: JorudanValidator.SEARCH_MODE_VALIDATOR.optional(),
    });
  // --- response body sub-type validators ---
  private static readonly STATION_CANDIDATE_VALIDATOR: z.ZodType<StationCandidate> = z.object({
    company: z.string(),
    kubun: JorudanValidator.TRANSIT_MODE_VALIDATOR,
    name: z.string(),
  });
  public static readonly SEN_RESPONSE_VALIDATOR: z.ZodType<JSenResponse> =
    JorudanValidator.responseValidator(
      z.object({
        eki: JorudanValidator.STATION_CANDIDATE_VALIDATOR.array(),
        num: z.coerce.number(),
      }),
    ) as z.ZodType<JSenResponse>;
  // --- 経路検索 (sr) ---
  public static readonly SR_REQUEST_VALIDATOR: z.ZodType<JSrRequest> =
    JorudanValidator.J_REQUEST_COMMON.extend({
      date: z
        .string()
        .regex(/^\d{8}$/)
        .optional(), // yyyymmdd
      eki1: z.string(),
      eki2: z.string(),
      kbn1: JorudanValidator.TRANSIT_MODE_VALIDATOR.optional(),
      kbn2: JorudanValidator.TRANSIT_MODE_VALIDATOR.optional(),
    });
  private static readonly IC_SUPPORT_VALIDATOR: z.ZodType<IcSupport> = z.coerce
    .number()
    .pipe(z.enum(IcSupport));
  private static readonly HAVE_DIAGRAM_VALIDATOR: z.ZodType<HaveDiagram> = z.coerce
    .number()
    .pipe(z.enum(HaveDiagram));
  private static readonly LINE_COLOR_TYPE_VALIDATOR: z.ZodType<LineColorType> = z.coerce
    .number()
    .pipe(z.enum(LineColorType));
  private static readonly LINE_COLOR_VALIDATOR: z.ZodType<LineColor> = z.object({
    num: z.coerce.number(),
    rgb: z.string().array(),
    type: JorudanValidator.LINE_COLOR_TYPE_VALIDATOR,
  });
  private static readonly NORIKAE_VALIDATOR: z.ZodType<Norikae> = z.coerce
    .number()
    .pipe(z.enum(Norikae));
  private static readonly ROSEN_SYUBETU_VALIDATOR: z.ZodType<RosenSyubetu> = z.coerce
    .number()
    .pipe(z.enum(RosenSyubetu));
  private static readonly SEAT_OPTION_VALIDATOR: z.ZodType<SeatOption> = z.object({
    airLine: z.string(),
    code: z.string(),
    id: z.coerce.number(),
    name: z.string(),
    untin: z.coerce.number(),
  });
  private static readonly SEAT_KUBUN_VALIDATOR: z.ZodType<SeatKubun> = z.object({
    kubun: JorudanValidator.SEAT_OPTION_VALIDATOR.array().optional(),
    num: z.coerce.number(),
  });
  private static readonly TIME_TYPE_VALIDATOR: z.ZodType<TimeType> = z.coerce
    .number()
    .pipe(z.enum(TimeType));
  private static readonly TOKKYU_KISETU_VALIDATOR: z.ZodType<TokkyuKisetu> = z.coerce
    .number()
    .pipe(z.enum(TokkyuKisetu));
  private static readonly TOKKYU_WARIBIKI_VALIDATOR: z.ZodType<TokkyuWaribiki> = z.coerce
    .number()
    .pipe(z.enum(TokkyuWaribiki));
  private static readonly TOKUREI_INFO_VALIDATOR: z.ZodType<TokureiInfo> = z.object({
    code: z.string(),
    id: z.coerce.number(),
    name: z.string(),
    text: z.string(),
  });

  private static readonly TOKUREI_VALIDATOR: z.ZodType<Tokurei> = z.object({
    data: z.coerce.number(),
    info: JorudanValidator.TOKUREI_INFO_VALIDATOR.array(),
    num: z.coerce.number(),
  });

  private static readonly UNTIN_GAKUSEI_VALIDATOR: z.ZodType<UntinGakusei> = z.coerce
    .number()
    .pipe(z.enum(UntinGakusei));

  private static readonly UNTIN_OUFUKU_VALIDATOR: z.ZodType<UntinOufuku> = z.coerce
    .number()
    .pipe(z.enum(UntinOufuku));

  private static readonly USE_DIAGRAM_VALIDATOR: z.ZodType<UseDiagram> = z.coerce
    .number()
    .pipe(z.enum(UseDiagram));

  private static readonly PATH_VALIDATOR: z.ZodType<Path> = z.object({
    airLine: z.string(),
    busCorp: z.string(),
    co2: z.coerce.number(),
    direction: z.coerce.number(),
    from: z.string(),
    fromDate: z.string(),
    fromExt: z.string(),
    fromPlatform: z.string(),
    fromTime: z.string(),
    fromTimeType: JorudanValidator.TIME_TYPE_VALIDATOR,
    fromX: z.string(),
    fromY: z.string(),
    haveDiagram: JorudanValidator.HAVE_DIAGRAM_VALIDATOR,
    icExist: JorudanValidator.IC_SUPPORT_VALIDATOR,
    icTokkyu: z.coerce.number(),
    icTokkyuGreen: z.coerce.number(),
    icTokkyuTuusan: z.coerce.number(),
    icTokurei: JorudanValidator.TOKUREI_VALIDATOR,
    icUntin: z.coerce.number(),
    icUntinGakusei: JorudanValidator.UNTIN_GAKUSEI_VALIDATOR,
    icUntinTuusan: z.coerce.number(),
    id: z.coerce.number(),
    idou: z.coerce.number(),
    jikan: z.coerce.number(),
    josyaText: z.string(),
    kyori: z.coerce.number(),
    lineColor: JorudanValidator.LINE_COLOR_VALIDATOR,
    lineIndex: z.coerce.number(),
    lineName: z.string(),
    lineType: z.string(),
    mati: z.coerce.number(),
    norikae: JorudanValidator.NORIKAE_VALIDATOR,
    rosen: z.string(),
    rosenCorp: z.string(),
    rosenSyubetu: JorudanValidator.ROSEN_SYUBETU_VALIDATOR,
    seatCode: z.string(),
    seatKubun: JorudanValidator.SEAT_KUBUN_VALIDATOR,
    seatName: z.string(),
    selectLine: z.string(),
    to: z.string(),
    toDate: z.string(),
    toExt: z.string(),
    tokkyu: z.coerce.number(),
    tokkyuGreen: z.coerce.number(),
    tokkyuKisetu: JorudanValidator.TOKKYU_KISETU_VALIDATOR,
    tokkyuShindai: z.coerce.number(),
    tokkyuTuusan: z.coerce.number(),
    tokkyuWaribiki: JorudanValidator.TOKKYU_WARIBIKI_VALIDATOR,
    tokurei: JorudanValidator.TOKUREI_VALIDATOR,
    toPlatform: z.string(),
    toTime: z.string(),
    toTimeType: JorudanValidator.TIME_TYPE_VALIDATOR,
    toX: z.string(),
    toY: z.string(),
    untin: z.coerce.number(),
    untinGakusei: JorudanValidator.UNTIN_GAKUSEI_VALIDATOR,
    untinOufuku: JorudanValidator.UNTIN_OUFUKU_VALIDATOR,
    untinTuusan: z.coerce.number(),
    useDiagram: JorudanValidator.USE_DIAGRAM_VALIDATOR,
  });

  private static readonly IS_INCLUDED_VALIDATOR: z.ZodType<IsIncluded> = z.coerce
    .number()
    .pipe(z.enum(IsIncluded));

  private static readonly ROUTE_KUBUN_VALIDATOR: z.ZodType<RouteKubun> = z.object({
    bus: JorudanValidator.IS_INCLUDED_VALIDATOR,
    ferry: JorudanValidator.IS_INCLUDED_VALIDATOR,
    jr: JorudanValidator.IS_INCLUDED_VALIDATOR,
    kousoku: JorudanValidator.IS_INCLUDED_VALIDATOR,
    kuuro: JorudanValidator.IS_INCLUDED_VALIDATOR,
    nozomi: JorudanValidator.IS_INCLUDED_VALIDATOR,
    renraku: JorudanValidator.IS_INCLUDED_VALIDATOR,
    shindai: JorudanValidator.IS_INCLUDED_VALIDATOR,
    shinkansen: JorudanValidator.IS_INCLUDED_VALIDATOR,
    shinya: JorudanValidator.IS_INCLUDED_VALIDATOR,
    toho: JorudanValidator.IS_INCLUDED_VALIDATOR,
    tokkyu: JorudanValidator.IS_INCLUDED_VALIDATOR,
    value: z.string(),
    yuryou: JorudanValidator.IS_INCLUDED_VALIDATOR,
  });

  private static readonly CO2_EMISSION_VALIDATOR: z.ZodType<CO2Emission> = z.coerce
    .number()
    .pipe(z.enum(CO2Emission));

  private static readonly HAYAI_VALIDATOR: z.ZodType<Hayai> = z.coerce.number().pipe(z.enum(Hayai));

  private static readonly IC_SPECIAL_PRICE_VALIDATOR: z.ZodType<IcSpecialPrice> = z.coerce
    .number()
    .pipe(z.enum(IcSpecialPrice));

  private static readonly KOUSOKU_VALIDATOR: z.ZodType<Kousoku> = z.coerce
    .number()
    .pipe(z.enum(Kousoku));

  private static readonly KUURO_VALIDATOR: z.ZodType<Kuuro> = z.coerce.number().pipe(z.enum(Kuuro));

  private static readonly RAKU_VALIDATOR: z.ZodType<Raku> = z.coerce.number().pipe(z.enum(Raku));

  private static readonly SHINDAI_VALIDATOR: z.ZodType<Shindai> = z.coerce
    .number()
    .pipe(z.enum(Shindai));

  private static readonly SYUBETU_VALIDATOR: z.ZodType<Syubetu> = z.coerce
    .number()
    .pipe(z.enum(Syubetu));

  private static readonly YASUI_VALIDATOR: z.ZodType<Yasui> = z.coerce.number().pipe(z.enum(Yasui));

  private static readonly ROUTE_STATUS_VALIDATOR: z.ZodType<RouteStatus> = z.object({
    co2: JorudanValidator.CO2_EMISSION_VALIDATOR,
    hayai: JorudanValidator.HAYAI_VALIDATOR,
    icCard: JorudanValidator.IC_SPECIAL_PRICE_VALIDATOR,
    kousoku: JorudanValidator.KOUSOKU_VALIDATOR,
    kuuro: JorudanValidator.KUURO_VALIDATOR,
    norikae: JorudanValidator.HAYAI_VALIDATOR,
    raku: JorudanValidator.RAKU_VALIDATOR,
    shindai: JorudanValidator.SHINDAI_VALIDATOR,
    syubetu: JorudanValidator.SYUBETU_VALIDATOR,
    value: z.string(),
    yasui: JorudanValidator.YASUI_VALIDATOR,
  });

  private static readonly HYOUKA_VALIDATOR: z.ZodType<Hyouka> = z.object({
    hiyou: z.coerce.number(),
    icExist: JorudanValidator.IC_SUPPORT_VALIDATOR,
    icHiyou: z.coerce.number(),
    jikan: z.coerce.number(),
    kubun: JorudanValidator.ROUTE_KUBUN_VALIDATOR,
    kyori: z.coerce.number(),
    norikaeCnt: z.coerce.number(),
    path: JorudanValidator.PATH_VALIDATOR.array(),
    pathCnt: z.coerce.number(),
    status: JorudanValidator.ROUTE_STATUS_VALIDATOR,
  });

  private static readonly ROUTE_VALIDATOR: z.ZodType<Route> = z.object({
    hyouka: JorudanValidator.HYOUKA_VALIDATOR,
    id: z.coerce.number(),
  });

  public static readonly SR_RESPONSE_VALIDATOR: z.ZodType<JSrResponse> =
    JorudanValidator.responseValidator(
      z.object({
        jrdurl: z.string(),
        num: z.coerce.number(),
        route: JorudanValidator.ROUTE_VALIDATOR.array(),
        storeData: z.string(),
      }),
    ) as z.ZodType<JSrResponse>;

  // --- 路線名検索 (srn) ---
  public static readonly SRN_REQUEST_VALIDATOR: z.ZodType<JSrnRequest> =
    JorudanValidator.J_REQUEST_COMMON.extend({
      opt1: JorudanValidator.SEARCH_MODE_VALIDATOR.optional(),
      rsn: z.string(),
    });

  // --- numeric-value enum validators (API returns string numbers) ---
  private static readonly DIAGRAM_VALIDATOR: z.ZodType<Diagram> = z.coerce
    .number()
    .pipe(z.enum(Diagram));

  private static readonly ROSEN_VALIDATOR: z.ZodType<Rosen> = z.object({
    company: z.string(),
    diagram: JorudanValidator.DIAGRAM_VALIDATOR,
    kubun: JorudanValidator.LINE_KUBUN_VALIDATOR,
    name: z.string(),
  });

  public static readonly SRN_RESPONSE_VALIDATOR: z.ZodType<JSrnResponse> =
    JorudanValidator.responseValidator(
      z.object({
        num: z.coerce.number(),
        rosen: JorudanValidator.ROSEN_VALIDATOR.array(),
      }),
    ) as z.ZodType<JSrnResponse>;

  private static readonly J_ERROR_CODE_VALIDATOR: z.ZodType<JErrorCode> = z.enum(JErrorCode);

  // --- generic response wrapper ---
  private static responseValidator<T extends Record<string, unknown>>(
    bodyValidator: z.ZodType<T>,
  ): z.ZodType<JResponseCommon<T>> {
    return z.object({
      NorikaeBizApiResult: z.object({
        body: bodyValidator,
        head: z.object({
          errorCode: JorudanValidator.J_ERROR_CODE_VALIDATOR,
          functionCode: z.string(),
          rq: z.string(),
        }),
      }),
    }) as unknown as z.ZodType<JResponseCommon<T>>;
  }
}
