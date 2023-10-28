import rss, { pagesGlobToRssItems } from "@astrojs/rss";

export async function GET(context: { site: string }): Promise<Response> {
  return rss({
    title: "Blog | pawcode Development",
    description:
      " I write about interesting stuff I came across while working on projects or just for fun as well as small tutorials and guides.",
    site: context.site,
    items: await pagesGlobToRssItems(import.meta.glob("./posts/*.{md,mdx}")),
  });
}
