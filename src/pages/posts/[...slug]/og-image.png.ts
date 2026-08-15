import type { APIRoute, GetStaticPathsItem } from "astro";
import { getCollection } from "astro:content";
import { generateDigest } from "../../../utils/generate-digest";
import { generateOgImage } from "../../../utils/og-image";

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map(
    (post) =>
      ({
        params: { slug: post.id },
        props: { post },
        cacheKey: post.digest ?? generateDigest(post),
      }) satisfies GetStaticPathsItem,
  );
}

export const GET: APIRoute = async function get({
  props,
  url,
}): Promise<Response> {
  const png = await generateOgImage(
    url,
    props.post.data.title,
    props.post.data.author,
  );

  return new Response(Buffer.from(png), {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
