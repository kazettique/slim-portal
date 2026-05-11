import { z } from "zod/v4";
import {
  CO2Emission,
  Diagram,
  HaveDiagram,
  Hayai,
  Hyouka,
  IcSpecialPrice,
  IcSupport,
  IsIncluded,
  JErrorCode,
  Kousoku,
  Kuuro,
  LineColor,
  LineColorType,
  LineKubun,
  LineStation,
  Norikae,
  ObtainMode,
  Path,
  Raku,
  Rosen,
  RosenBase,
  RosenSyubetu,
  Route,
  RouteKubun,
  RouteStatus,
  SearchMode,
  SeatKubun,
  SeatOption,
  Shindai,
  StationCandidate,
  Syubetu,
  TimeType,
  TokkyuKisetu,
  TokkyuWaribiki,
  Tokurei,
  TokureiInfo,
  TransitMode,
  UntinGakusei,
  UntinOufuku,
  UseDiagram,
  Yasui,
} from "./type.common";
import {
  JGerRequest,
  JGerResponse,
  JGreRequest,
  JGreResponse,
  JRequestCommon,
  JResponseCommon,
  JSenRequest,
  JSenResponse,
  JSrnRequest,
  JSrnResponse,
  JSrRequest,
  JSrResponse,
} from "./type";

export abstract class JorudanValidator {
  // --- string-value enum validators ---
  private static readonly SEARCH_MODE_VALIDATOR: z.ZodType<SearchMode> = z.enum(SearchMode);
  private static readonly OBTAIN_MODE_VALIDATOR: z.ZodType<ObtainMode> = z.enum(ObtainMode);
  private static readonly TRANSIT_MODE_VALIDATOR: z.ZodType<TransitMode> = z.enum(TransitMode);
  private static readonly LINE_KUBUN_VALIDATOR: z.ZodType<LineKubun> = z.enum(LineKubun);
  private static readonly J_ERROR_CODE_VALIDATOR: z.ZodType<JErrorCode> = z.enum(JErrorCode);

  // --- numeric-value enum validators (API returns string numbers) ---
  private static readonly DIAGRAM_VALIDATOR: z.ZodType<Diagram> = z.coerce.number().pipe(z.enum(Diagram));
  private static readonly ROSEN_SYUBETU_VALIDATOR: z.ZodType<RosenSyubetu> = z.coerce
    .number()
    .pipe(z.enum(RosenSyubetu));
  private static readonly NORIKAE_VALIDATOR: z.ZodType<Norikae> = z.coerce.number().pipe(z.enum(Norikae));
  private static readonly UNTIN_OUFUKU_VALIDATOR: z.ZodType<UntinOufuku> = z.coerce.number().pipe(z.enum(UntinOufuku));
  private static readonly UNTIN_GAKUSEI_VALIDATOR: z.ZodType<UntinGakusei> = z.coerce
    .number()
    .pipe(z.enum(UntinGakusei));
  private static readonly TOKKYU_KISETU_VALIDATOR: z.ZodType<TokkyuKisetu> = z.coerce
    .number()
    .pipe(z.enum(TokkyuKisetu));
  private static readonly TOKKYU_WARIBIKI_VALIDATOR: z.ZodType<TokkyuWaribiki> = z.coerce
    .number()
    .pipe(z.enum(TokkyuWaribiki));
  private static readonly TIME_TYPE_VALIDATOR: z.ZodType<TimeType> = z.coerce.number().pipe(z.enum(TimeType));
  private static readonly LINE_COLOR_TYPE_VALIDATOR: z.ZodType<LineColorType> = z.coerce
    .number()
    .pipe(z.enum(LineColorType));
  private static readonly HAVE_DIAGRAM_VALIDATOR: z.ZodType<HaveDiagram> = z.coerce.number().pipe(z.enum(HaveDiagram));
  private static readonly USE_DIAGRAM_VALIDATOR: z.ZodType<UseDiagram> = z.coerce.number().pipe(z.enum(UseDiagram));
  private static readonly IC_SUPPORT_VALIDATOR: z.ZodType<IcSupport> = z.coerce.number().pipe(z.enum(IcSupport));
  private static readonly IS_INCLUDED_VALIDATOR: z.ZodType<IsIncluded> = z.coerce.number().pipe(z.enum(IsIncluded));
  private static readonly HAYAI_VALIDATOR: z.ZodType<Hayai> = z.coerce.number().pipe(z.enum(Hayai));
  private static readonly YASUI_VALIDATOR: z.ZodType<Yasui> = z.coerce.number().pipe(z.enum(Yasui));
  private static readonly RAKU_VALIDATOR: z.ZodType<Raku> = z.coerce.number().pipe(z.enum(Raku));
  private static readonly KUURO_VALIDATOR: z.ZodType<Kuuro> = z.coerce.number().pipe(z.enum(Kuuro));
  private static readonly SHINDAI_VALIDATOR: z.ZodType<Shindai> = z.coerce.number().pipe(z.enum(Shindai));
  private static readonly KOUSOKU_VALIDATOR: z.ZodType<Kousoku> = z.coerce.number().pipe(z.enum(Kousoku));
  private static readonly IC_SPECIAL_PRICE_VALIDATOR: z.ZodType<IcSpecialPrice> = z.coerce
    .number()
    .pipe(z.enum(IcSpecialPrice));
  private static readonly CO2_EMISSION_VALIDATOR: z.ZodType<CO2Emission> = z.coerce.number().pipe(z.enum(CO2Emission));
  private static readonly SYUBETU_VALIDATOR: z.ZodType<Syubetu> = z.coerce.number().pipe(z.enum(Syubetu));

  // --- common base (used for .extend() on request validators) ---
  private static readonly J_REQUEST_COMMON = z.object({
    ak: z.string(),
    rq: z.string().optional(),
  });

  // --- response body sub-type validators ---
  private static readonly STATION_CANDIDATE_VALIDATOR: z.ZodType<StationCandidate> = z.object({
    name: z.string(),
    company: z.string(),
    kubun: JorudanValidator.TRANSIT_MODE_VALIDATOR,
  });

  private static readonly ROSEN_VALIDATOR: z.ZodType<Rosen> = z.object({
    name: z.string(),
    company: z.string(),
    kubun: JorudanValidator.LINE_KUBUN_VALIDATOR,
    diagram: JorudanValidator.DIAGRAM_VALIDATOR,
  });

  private static readonly ROSEN_BASE_VALIDATOR: z.ZodType<RosenBase> = z.object({
    name: z.string(),
    kubun: JorudanValidator.LINE_KUBUN_VALIDATOR,
  });

  private static readonly LINE_STATION_VALIDATOR: z.ZodType<LineStation> = z.object({
    name: z.string(),
    kubun: JorudanValidator.TRANSIT_MODE_VALIDATOR,
  });

  private static readonly TOKUREI_INFO_VALIDATOR: z.ZodType<TokureiInfo> = z.object({
    code: z.string(),
    name: z.string(),
    text: z.string(),
    id: z.coerce.number(),
  });

  private static readonly TOKUREI_VALIDATOR: z.ZodType<Tokurei> = z.object({
    data: z.coerce.number(),
    num: z.coerce.number(),
    info: JorudanValidator.TOKUREI_INFO_VALIDATOR.array(),
  });

  private static readonly LINE_COLOR_VALIDATOR: z.ZodType<LineColor> = z.object({
    type: JorudanValidator.LINE_COLOR_TYPE_VALIDATOR,
    num: z.coerce.number(),
    rgb: z.string().array(),
  });

  private static readonly SEAT_OPTION_VALIDATOR: z.ZodType<SeatOption> = z.object({
    id: z.coerce.number(),
    code: z.string(),
    name: z.string(),
    airLine: z.string(),
    untin: z.coerce.number(),
  });

  private static readonly SEAT_KUBUN_VALIDATOR: z.ZodType<SeatKubun> = z.object({
    num: z.coerce.number(),
    kubun: JorudanValidator.SEAT_OPTION_VALIDATOR.array().optional(),
  });

  private static readonly ROUTE_STATUS_VALIDATOR: z.ZodType<RouteStatus> = z.object({
    hayai: JorudanValidator.HAYAI_VALIDATOR,
    yasui: JorudanValidator.YASUI_VALIDATOR,
    raku: JorudanValidator.RAKU_VALIDATOR,
    kuuro: JorudanValidator.KUURO_VALIDATOR,
    shindai: JorudanValidator.SHINDAI_VALIDATOR,
    kousoku: JorudanValidator.KOUSOKU_VALIDATOR,
    icCard: JorudanValidator.IC_SPECIAL_PRICE_VALIDATOR,
    norikae: JorudanValidator.HAYAI_VALIDATOR,
    co2: JorudanValidator.CO2_EMISSION_VALIDATOR,
    syubetu: JorudanValidator.SYUBETU_VALIDATOR,
    value: z.string(),
  });

  private static readonly ROUTE_KUBUN_VALIDATOR: z.ZodType<RouteKubun> = z.object({
    shinkansen: JorudanValidator.IS_INCLUDED_VALIDATOR,
    nozomi: JorudanValidator.IS_INCLUDED_VALIDATOR,
    tokkyu: JorudanValidator.IS_INCLUDED_VALIDATOR,
    shindai: JorudanValidator.IS_INCLUDED_VALIDATOR,
    kuuro: JorudanValidator.IS_INCLUDED_VALIDATOR,
    bus: JorudanValidator.IS_INCLUDED_VALIDATOR,
    kousoku: JorudanValidator.IS_INCLUDED_VALIDATOR,
    renraku: JorudanValidator.IS_INCLUDED_VALIDATOR,
    shinya: JorudanValidator.IS_INCLUDED_VALIDATOR,
    ferry: JorudanValidator.IS_INCLUDED_VALIDATOR,
    toho: JorudanValidator.IS_INCLUDED_VALIDATOR,
    yuryou: JorudanValidator.IS_INCLUDED_VALIDATOR,
    jr: JorudanValidator.IS_INCLUDED_VALIDATOR,
    value: z.string(),
  });

  private static readonly PATH_VALIDATOR: z.ZodType<Path> = z.object({
    id: z.coerce.number(),
    rosen: z.string(),
    rosenSyubetu: JorudanValidator.ROSEN_SYUBETU_VALIDATOR,
    from: z.string(),
    fromExt: z.string(),
    to: z.string(),
    toExt: z.string(),
    kyori: z.coerce.number(),
    jikan: z.coerce.number(),
    norikae: JorudanValidator.NORIKAE_VALIDATOR,
    mati: z.coerce.number(),
    idou: z.coerce.number(),
    direction: z.coerce.number(),
    seatName: z.string(),
    seatCode: z.string(),
    seatKubun: JorudanValidator.SEAT_KUBUN_VALIDATOR,
    untin: z.coerce.number(),
    untinOufuku: JorudanValidator.UNTIN_OUFUKU_VALIDATOR,
    untinTuusan: z.coerce.number(),
    untinGakusei: JorudanValidator.UNTIN_GAKUSEI_VALIDATOR,
    tokkyu: z.coerce.number(),
    tokkyuGreen: z.coerce.number(),
    tokkyuShindai: z.coerce.number(),
    tokkyuKisetu: JorudanValidator.TOKKYU_KISETU_VALIDATOR,
    tokkyuWaribiki: JorudanValidator.TOKKYU_WARIBIKI_VALIDATOR,
    tokkyuTuusan: z.coerce.number(),
    icExist: JorudanValidator.IC_SUPPORT_VALIDATOR,
    icUntin: z.coerce.number(),
    icUntinTuusan: z.coerce.number(),
    icUntinGakusei: JorudanValidator.UNTIN_GAKUSEI_VALIDATOR,
    icTokkyu: z.coerce.number(),
    icTokkyuGreen: z.coerce.number(),
    icTokkyuTuusan: z.coerce.number(),
    airLine: z.string(),
    fromDate: z.string(),
    fromTime: z.string(),
    fromTimeType: JorudanValidator.TIME_TYPE_VALIDATOR,
    toDate: z.string(),
    toTime: z.string(),
    toTimeType: JorudanValidator.TIME_TYPE_VALIDATOR,
    lineName: z.string(),
    lineIndex: z.coerce.number(),
    selectLine: z.string(),
    lineType: z.string(),
    lineColor: JorudanValidator.LINE_COLOR_VALIDATOR,
    haveDiagram: JorudanValidator.HAVE_DIAGRAM_VALIDATOR,
    useDiagram: JorudanValidator.USE_DIAGRAM_VALIDATOR,
    rosenCorp: z.string(),
    busCorp: z.string(),
    josyaText: z.string(),
    fromPlatform: z.string(),
    toPlatform: z.string(),
    tokurei: JorudanValidator.TOKUREI_VALIDATOR,
    icTokurei: JorudanValidator.TOKUREI_VALIDATOR,
    co2: z.coerce.number(),
    fromX: z.string(),
    fromY: z.string(),
    toX: z.string(),
    toY: z.string(),
  });

  private static readonly HYOUKA_VALIDATOR: z.ZodType<Hyouka> = z.object({
    pathCnt: z.coerce.number(),
    jikan: z.coerce.number(),
    hiyou: z.coerce.number(),
    icHiyou: z.coerce.number(),
    icExist: JorudanValidator.IC_SUPPORT_VALIDATOR,
    kyori: z.coerce.number(),
    norikaeCnt: z.coerce.number(),
    status: JorudanValidator.ROUTE_STATUS_VALIDATOR,
    kubun: JorudanValidator.ROUTE_KUBUN_VALIDATOR,
    path: JorudanValidator.PATH_VALIDATOR.array(),
  });

  private static readonly ROUTE_VALIDATOR: z.ZodType<Route> = z.object({
    id: z.coerce.number(),
    hyouka: JorudanValidator.HYOUKA_VALIDATOR,
  });

  // --- generic response wrapper ---
  private static responseValidator<T extends Record<string, unknown>>(
    bodyValidator: z.ZodType<T>,
  ): z.ZodType<JResponseCommon<T>> {
    return z.object({
      NorikaeBizApiResult: z.object({
        head: z.object({
          functionCode: z.string(),
          errorCode: JorudanValidator.J_ERROR_CODE_VALIDATOR,
          rq: z.string(),
        }),
        body: bodyValidator,
      }),
    }) as unknown as z.ZodType<JResponseCommon<T>>;
  }

  // --- 駅名検索 (sen) ---
  public static readonly SEN_REQUEST_VALIDATOR: z.ZodType<JSenRequest> = JorudanValidator.J_REQUEST_COMMON.extend({
    eki1: z.string(),
    opt1: JorudanValidator.SEARCH_MODE_VALIDATOR.optional(),
  });

  public static readonly SEN_RESPONSE_VALIDATOR: z.ZodType<JSenResponse> = JorudanValidator.responseValidator(
    z.object({
      num: z.coerce.number(),
      eki: JorudanValidator.STATION_CANDIDATE_VALIDATOR.array(),
    }),
  ) as z.ZodType<JSenResponse>;

  // --- 路線名検索 (srn) ---
  public static readonly SRN_REQUEST_VALIDATOR: z.ZodType<JSrnRequest> = JorudanValidator.J_REQUEST_COMMON.extend({
    rsn: z.string(),
    opt1: JorudanValidator.SEARCH_MODE_VALIDATOR.optional(),
  });

  public static readonly SRN_RESPONSE_VALIDATOR: z.ZodType<JSrnResponse> = JorudanValidator.responseValidator(
    z.object({
      num: z.coerce.number(),
      rosen: JorudanValidator.ROSEN_VALIDATOR.array(),
    }),
  ) as z.ZodType<JSrnResponse>;

  // --- 駅の接続路線取得 (ger) ---
  public static readonly GER_REQUEST_VALIDATOR: z.ZodType<JGerRequest> = JorudanValidator.J_REQUEST_COMMON.extend({
    eki1: z.string(),
    opt1: JorudanValidator.OBTAIN_MODE_VALIDATOR.optional(),
  });

  public static readonly GER_RESPONSE_VALIDATOR: z.ZodType<JGerResponse> = JorudanValidator.responseValidator(
    z.object({
      num: z.coerce.number(),
      rosen: JorudanValidator.ROSEN_BASE_VALIDATOR.array(),
    }),
  ) as z.ZodType<JGerResponse>;

  // --- 路線の所属駅取得 (gre) ---
  public static readonly GRE_REQUEST_VALIDATOR: z.ZodType<JGreRequest> = JorudanValidator.J_REQUEST_COMMON.extend({
    rsn: z.string(),
  });

  public static readonly GRE_RESPONSE_VALIDATOR: z.ZodType<JGreResponse> = JorudanValidator.responseValidator(
    z.object({
      num: z.coerce.number(),
      eki: JorudanValidator.LINE_STATION_VALIDATOR.array(),
    }),
  ) as z.ZodType<JGreResponse>;

  // --- 経路検索 (sr) ---
  public static readonly SR_REQUEST_VALIDATOR: z.ZodType<JSrRequest> = JorudanValidator.J_REQUEST_COMMON.extend({
    eki1: z.string(),
    eki2: z.string(),
    kbn1: JorudanValidator.TRANSIT_MODE_VALIDATOR.optional(),
    kbn2: JorudanValidator.TRANSIT_MODE_VALIDATOR.optional(),
    date: z
      .string()
      .regex(/^\d{8}$/)
      .optional(), // yyyymmdd
  });

  public static readonly SR_RESPONSE_VALIDATOR: z.ZodType<JSrResponse> = JorudanValidator.responseValidator(
    z.object({
      jrdurl: z.string(),
      num: z.coerce.number(),
      storeData: z.string(),
      route: JorudanValidator.ROUTE_VALIDATOR.array(),
    }),
  ) as z.ZodType<JSrResponse>;
}
