import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.optional(z.string()),
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
