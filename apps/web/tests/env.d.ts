/// <reference types="astro/client" />

declare module "*.astro" {
  type AstroComponentFactory = Parameters<
    import("astro/container").experimental_AstroContainer["renderToString"]
  >[0];
  const Component: AstroComponentFactory;
  export default Component;
}
