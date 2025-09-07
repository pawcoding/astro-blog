import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { CATEGORIES } from "./constants/categories";

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.optional(z.string()),
    // @ts-expect-error - Map does not create a readonly array
    category: z.enum(CATEGORIES.map((category) => category.url)),
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
