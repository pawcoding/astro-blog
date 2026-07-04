import { defineHastPlugin } from "satteri";

interface Options {
  domain: string;
}

export function externalLink(options?: Options) {
  const siteDomain = options?.domain ?? "";

  return defineHastPlugin({
    name: "external-links",
    element: {
      filter: ["a"],
      visit(node, ctx) {
        const href = node.properties?.href;
        const url = typeof href === "string" ? href : String(href ?? "");
        if (isExternal(url, siteDomain)) {
          ctx.setProperty(node, "target", "_blank");
        }
      },
    },
  });
}

function isExternal(url: string, domain: string) {
  return url.startsWith("http") && !url.includes(domain);
}
