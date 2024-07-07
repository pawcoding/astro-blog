import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import matomo from "astro-matomo";
import astroMetaTags from "astro-meta-tags";
import robotsTxt from "astro-robots-txt";
import { defineConfig } from "astro/config";
import { externalLink } from "./src/utils/external-link";
import { calculateReadingTime } from "./src/utils/reading-time";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.pawcode.de",
  markdown: {
    rehypePlugins: [
      [
        externalLink,
        {
          domain: "blog.pawcode.de",
        },
      ],
    ],
    remarkPlugins: [calculateReadingTime],
  },
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
    icon(),
    astroMetaTags(),
    robotsTxt(),
    solidJs(),
  ],
});
