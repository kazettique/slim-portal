import { ShareConstant } from "@slim-portal/share/constant";

export abstract class SwConstant {
  public static readonly SHELL_CACHE: string = "shell-v1";
  public static readonly API_CACHE: string = "api-v1";
  public static readonly SHELL_URLS: string[] = ShareConstant.PAGE_URLS;
}
