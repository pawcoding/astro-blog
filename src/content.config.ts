import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { CATEGORIES } from "./constants/categories";

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.optional(z.string()),
    category: z.enum(
      CATEGORIES.map((category) => category.url) as [string, ...string[]],
    ),
    pubDate: z.date(),
    modDate: z.optional(z.date()),
    color: z.string().default("#4472c4"),
    author: z.string().default("Luis Wolf"),
    tags: z.optional(z.array(z.string())),
  }),
});

export const collections = {
  posts: postsCollection,
};
