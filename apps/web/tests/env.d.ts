/// <reference types="astro/client" />

import type { experimental_AstroContainer } from "astro/container";

declare module "*.astro" {
  type AstroComponentFactory = Parameters<experimental_AstroContainer["renderToString"]>[0];
  const Component: AstroComponentFactory;
  export default Component;
}
