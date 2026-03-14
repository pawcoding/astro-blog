import { fontData } from "astro:assets";
import fs from "fs/promises";
import path from "path";
import satori from "satori";
import sharp from "sharp";

export async function generateOgImage(
  title: string,
  subtitle?: string,
): Promise<Buffer> {
  const sourceSansFace = fontData["--font-source-sans-3"]?.find(
    (f) => f.weight === "700" && f.style === "normal",
  );
  const sourceSansEntry = sourceSansFace?.src?.find((s) =>
    s.url.endsWith(".ttf"),
  );
  if (!sourceSansEntry)
    throw new Error(
      "Source Sans 3 weight-700 normal TTF font data not found in fontData",
    );
  // During static build prerendering there is no live HTTP server, so we read
  // the font directly from the output directory on disk.
  const fontPath = path.join(process.cwd(), "dist", sourceSansEntry.url);
  const font = await fs.readFile(fontPath).catch(() => {
    throw new Error(`Failed to read Source Sans 3 font from disk: ${fontPath}`);
  });
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
          subtitle
            ? {
                type: "div",
                props: {
                  children: subtitle,
                  style: {
                    fontSize: 40,
                    marginTop: 20,
                  },
                },
              }
            : null,
        ],
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          fontWeight: 700,
          textAlign: "center",
        },
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Source Sans 3", data: font, weight: 700, style: "normal" },
      ],
    },
  );

  return await sharp(Buffer.from(svg)).png().toBuffer();
}
