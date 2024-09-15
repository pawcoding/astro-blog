import fs from "fs";
import path from "path";

// Read the RSS feed
const feedPath = path.join(process.cwd(), "dist", "rss.xml");
const feed = fs.readFileSync(feedPath, "utf8");

// Extract the titles and links
const titles = feed
  .match(/<title>(.*?)<\/title>/g)
  .map((title) => title.replace(/<\/?title>/g, ""));
const links = feed
  .match(/<link>(.*?)<\/link>/g)
  .map((link) => link.replace(/<\/?link>/g, ""));

// Create the blog list
const blogList = titles.map((title, index) => {
  return {
    title,
    link:
      links[index] +
      "?mtm_compaign=GitHub&mtm_kwd=astro-blog&mtm_source=GitHub",
  };
});
// Remove the homepage
blogList.shift();
// Keep only the first 3 blog posts
blogList.splice(3);

// Read the README
const readmePath = path.join(process.cwd(), "README.md");
const readme = fs.readFileSync(readmePath, "utf8");

// Update the blog list
const updatedReadme = readme.replace(
  /<!-- BLOG-POST-LIST:START -->[\s\S]*<!-- BLOG-POST-LIST:END -->/,
  `<!-- BLOG-POST-LIST:START -->\n${blogList
    .map((blog) => `- [${blog.title}](${blog.link})\n`)
    .join("")}<!-- BLOG-POST-LIST:END -->`,
);

// Write the updated README
fs.writeFileSync(readmePath, updatedReadme);

console.info("Blog list updated successfully!");
