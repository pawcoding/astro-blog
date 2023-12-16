import type { RehypePlugin } from "@astrojs/markdown-remark";
import type { Element } from "hast";
import { visit } from "unist-util-visit";

interface Options {
  domain: string;
}

export const externalLink: RehypePlugin = (options?: Options) => {
  const siteDomain = options?.domain ?? "";

  return (tree) => {
    visit(tree, (node) => {
      if (node.type != "element") {
        return;
      }

      const element = node as Element;

      if (!isAnchor(element)) {
        return;
      }

      const url = getUrl(element);

      if (isExternal(url, siteDomain)) {
        element.properties!["target"] = "_blank";
      }
    });
  };
};

function isAnchor(element: Element) {
  return (
    element.tagName == "a" && element.properties && "href" in element.properties
  );
}

function getUrl(element: Element) {
  if (!element.properties) {
    return "";
  }

  const url = element.properties["href"];

  if (!url) {
    return "";
  }

  return url.toString();
}

function isExternal(url: string, domain: string) {
  return url.startsWith("http") && !url.includes(domain);
}
