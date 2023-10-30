import type { APIRoute } from "astro";
import fs from "fs/promises";
import satori from "satori";
import sharp from "sharp";

export const GET: APIRoute = async function get({
  params,
  request,
}): Promise<Response> {
  const font = await fs.readFile("./public/fonts/Roboto-Regular.ttf");
  const logo = await fs.readFile("./public/brand/pawcode-logo.png");

  const svg = await satori(
    {
      type: "div",
      props: {
        children: [
          {
            type: "div",
            props: {
              style: {
                backgroundImage: `url('data:image/png;base64,${logo.toString(
                  "base64",
                )}')`,
                width: 743,
                height: 171,
              },
            },
          },
          /* {
            type: "div",
            props: {
              children: "pawcode Development Blog",
              style: {
                marginTop: 40,
              },
            },
          }, */
        ],
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          fontSize: 32,
          fontWeight: 600,
        },
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Roboto", data: font, weight: 500, style: "normal" }],
    },
  );

  /* return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
    },
  }); */

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
