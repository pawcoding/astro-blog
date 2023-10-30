import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().default("/images/introduction-to-htmx.webp"),
    pubDate: z.date(),
    modDate: z.date().optional(),
    color: z.string().default("#4472c4"),
    author: z.string().default("Luis Wolf"),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
