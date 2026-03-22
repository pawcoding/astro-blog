import { fontData } from "astro:assets";
import satori from "satori";
import sharp from "sharp";

export async function generateOgImage(
  title: string,
  subtitle?: string,
  requestUrl?: URL,
): Promise<Buffer> {
  const sourceSansFace = fontData["--font-source-sans-3"]?.find(
    (f) => f.weight === "700" && f.style === "normal",
  );
  const sourceSansEntry = sourceSansFace?.src?.find((s) =>
    s.url.endsWith(".ttf"),
  );
  if (!sourceSansEntry)
    throw new Error(
      "Source Sans 3 weight-700 normal font data not found in fontData",
    );
  const origin = requestUrl?.origin ?? "http://localhost:4321";
  const font = await fetch(new URL(sourceSansEntry.url, origin)).then((res) => {
    if (!res.ok)
      throw new Error(
        `Failed to fetch Source Sans 3 font: ${res.status} ${res.statusText}`,
      );
    return res.arrayBuffer();
  });
  const logo = await fetch(new URL("/brand/pawcode-logo.png", origin)).then(
    (res) => res.arrayBuffer(),
  );

  const svg = await satori(
    {
      type: "div",
      props: {
        children: [
          {
            type: "div",
            props: {
              style: {
                backgroundImage: `url('data:image/png;base64,${Buffer.from(logo).toString("base64")}')`,
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
