import type { APIRoute } from "astro";
import { generateOgImage } from "../utils/og-image";

export const GET: APIRoute = async function get({ url }): Promise<Response> {
  const png = await generateOgImage("Blog", undefined, url);

  return new Response(Buffer.from(png), {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
