import getReadingTime from "reading-time";
import { defineMdastPlugin } from "satteri";

export function calculateReadingTime() {
  return () => {
    let totalText = "";

    const updateFrontmatter = (ctx: any) => {
      const astro = ctx.data.astro;
      if (astro?.frontmatter) {
        const readingTime = getReadingTime(totalText);
        astro.frontmatter.minutesRead = readingTime.text;
        astro.frontmatter.words = readingTime.words;
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
