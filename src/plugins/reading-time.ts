import { defineMdastPlugin } from "satteri";
import getReadingTime from "reading-time";

export function calculateReadingTime() {
  return () => {
    let totalText = "";

    const updateFrontmatter = (ctx: any) => {
      const astro = ctx.data.astro;
      if (astro?.frontmatter) {
        astro.frontmatter.minutesRead = getReadingTime(totalText).text;
      }
    };

    return defineMdastPlugin({
      name: "reading-time",
      text(node, ctx) {
        totalText += " " + node.value;
        updateFrontmatter(ctx);
      },
      inlineCode(node, ctx) {
        totalText += " " + node.value;
        updateFrontmatter(ctx);
      },
      code(node, ctx) {
        totalText += " " + node.value;
        updateFrontmatter(ctx);
      },
    });
  };
}
