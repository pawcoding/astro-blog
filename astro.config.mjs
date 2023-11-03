import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import matomo from "astro-matomo";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.pawcode.de",
  integrations: [
    tailwind(),
    mdx(),
    matomo({
      enabled: import.meta.env.PROD,
      host: "https://analytics.apps.pawcode.de/",
      siteId: 9,
      disableCookies: true,
    }),
    sitemap({
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
