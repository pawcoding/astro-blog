import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { generateOgImage } from "../../../utils/og-image";

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export const GET: APIRoute = async function get({
  props,
  url,
}): Promise<Response> {
  const png = await generateOgImage(
    props.post.data.title,
    props.post.data.author,
    url,
  );

  return new Response(Buffer.from(png), {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
