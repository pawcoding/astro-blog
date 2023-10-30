import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { generateOgImage } from "../../../utils/og-image";

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

export const GET: APIRoute = async function get({ props }): Promise<Response> {
  const png = await generateOgImage(
    props.post.data.title,
    props.post.data.author,
  );

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
