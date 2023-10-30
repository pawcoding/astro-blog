import fs from "fs/promises";
import satori from "satori";
import sharp from "sharp";

export async function generateOgImage(title: string, subtitle?: string) {
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
          {
            type: "div",
            props: {
              children: title,
              style: {
                fontSize: 60,
                marginTop: 100,
              },
            },
          },
          subtitle ? {
            type: "div",
            props: {
              children: subtitle,
              style: {
                fontSize: 40,
                marginTop: 20,
              },
            },
          } : null,
        ],
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          fontWeight: 600,
          textAlign: "center",
        },
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Roboto", data: font, weight: 500, style: "normal" }],
    },
  );

  return await sharp(Buffer.from(svg)).png().toBuffer();
}
