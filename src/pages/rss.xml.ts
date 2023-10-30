import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: { site: string }): Promise<Response> {
  const posts = await getCollection("posts");
  return rss({
    title: "Blog | pawcode Development",
    description:
      " I write about interesting stuff I came across while working on projects or just for fun as well as small tutorials and guides.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: `/posts/${post.slug}`,
      pubDate: post.data.pubDate,
    })),
  });
}
