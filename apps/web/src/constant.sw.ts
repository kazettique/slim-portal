import { ShareConstant } from "@slim-portal/share/constant";

export abstract class SwConstant {
  public static readonly SHELL_CACHE: string = "shell-v2";
  public static readonly API_CACHE: string = "api-v1";
  // CF Pages serves pages at trailing-slash URLs (/bookmark/ not /bookmark).
  // Fetching without trailing slash causes a 301 redirect, and Safari refuses
  // to serve a redirected response from a service worker. Use trailing slashes
  // here so cache.addAll() fetches the canonical URLs directly (200, no redirect).
  public static readonly SHELL_URLS: string[] = ShareConstant.PAGE_URLS.map((url) =>
    url === "/" ? url : `${url}/`,
  );
}
