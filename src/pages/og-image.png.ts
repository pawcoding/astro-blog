import type { APIRoute } from "astro";
import { generateOgImage } from "../utils/og-image";

export const GET: APIRoute = async function get(): Promise<Response> {
  const png = await generateOgImage("Blog");

  return new Response(Buffer.from(png), {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
