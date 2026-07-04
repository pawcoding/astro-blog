import { defineHastPlugin } from "satteri";

export function autolinkHeadings() {
  return defineHastPlugin({
    name: "autolink-headings",
    element: {
      filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
      visit(node, ctx) {
        const id = node.properties?.id;
        if (typeof id !== "string") return;

        const anchor = {
          type: "element" as const,
          tagName: "a",
          properties: {
            href: "#" + id,
            ariaHidden: "true",
            tabIndex: -1,
          },
          children: [
            {
              type: "element" as const,
              tagName: "span",
              properties: { className: ["icon", "icon-link"] },
              children: [],
            },
          ],
        };

        ctx.appendChild(node, anchor);
      },
    },
  });
}
