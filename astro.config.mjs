import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import matomo from "astro-matomo";
import astroMetaTags from "astro-meta-tags";
import robotsTxt from "astro-robots-txt";
import { defineConfig, envField } from "astro/config";
import { loadEnv } from "vite";
import { externalLink } from "./src/utils/external-link";
import { calculateReadingTime } from "./src/utils/reading-time";
import { SITEMAP_BLACKLIST } from "./src/utils/sitemap-blacklist";

const env = loadEnv(process.env.NODE_ENV ?? "", process.cwd(), "");

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
    shikiConfig: {
      themes: {
        light: "github-light-default",
        dark: "github-dark-dimmed",
      },
    },
    remarkRehype: {
      footnoteBackContent: "Back to the content",
      footnoteLabel: "Footnotes",
      footnoteLabelTagName: "h3",
      footnoteLabelProperties: {
        className: "",
      },
    },
  },
  env: {
    schema: {
      MATOMO_URL: envField.string({ context: "client", access: "public" }),
      MATOMO_SITE_ID: envField.number({ context: "client", access: "public" }),
    },
  },
  integrations: [
    mdx(),
    matomo({
      enabled: import.meta.env.PROD,
      host: env.MATOMO_URL,
      siteId: parseInt(env.MATOMO_SITE_ID),
      disableCookies: true,
      heartBeatTimer: 15,
      preconnect: true,
      viewTransition: {
        contentElement: "main",
      },
    }),
    sitemap({
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !SITEMAP_BLACKLIST.includes(page),
    }),
    icon(),
    astroMetaTags(),
    robotsTxt(),
    solidJs(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    "/posts": "/",
  },
});
