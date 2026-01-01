# pawcode Blog

Here you can find all my articles.
I write about interesting stuff I came across while working on projects or just for fun as well as small tutorials and guides.
I hope you enjoy reading them as much as I enjoyed writing and researching them.

To see the blog in action, visit [blog.pawcode.de](https://blog.pawcode.de/?mtm_compaign=GitHub&mtm_kwd=astro-blog&mtm_source=GitHub).

<p align="right">
  <sub>
    <em>
      This repository is only public to view the source code.
      <br>
      I will not accept any pull requests or issues.
    </em>
  </sub>
</p>

---

### Latest blog posts

<!-- BLOG-POST-LIST:START -->
- [Yearly review: Looking back at 2025](https://blog.pawcode.de/posts/yearly-review-2025/?mtm_compaign=GitHub&mtm_kwd=astro-blog&mtm_source=GitHub)
- [Introduction to Redis Streams](https://blog.pawcode.de/posts/redis-streams/?mtm_compaign=GitHub&mtm_kwd=astro-blog&mtm_source=GitHub)
- [Building a local AI-powered Summarizer chat](https://blog.pawcode.de/posts/local-summarizer-chat/?mtm_compaign=GitHub&mtm_kwd=astro-blog&mtm_source=GitHub)
<!-- BLOG-POST-LIST:END -->

---

### Technical Details

**Frameworks**
<br />
<img alt="Frameworks" src="https://skillicons.dev/icons?i=astro,solidjs&theme=light" />

**Languages**
<br />
<img alt="Languages" src="https://skillicons.dev/icons?i=html,md,css,tailwind,ts&theme=light" />

**Tools**
<br />
<img alt="Tools" src="https://skillicons.dev/icons?i=vercel,github,githubactions,pnpm&theme=light" />

---

### Project Structure

```text
/
├── .github/workflows/   <-- GitHub Actions for semantic-release
│
├── public/              <-- Static assets like images
│
├── src/
│   ├── assets/          <-- Images that will be optimized by Astro
│   │
│   ├── components/      <-- Astro components like Header, Footer, etc.
│   │   │
│   │   └ posts/         <-- SolidJS components for interactive blog elements
│   │
│   ├── content/
│   │   └ posts/         <-- Markdown files for blog posts
│   │
│   ├── layouts/         <-- Layout components like base or post layout
│   │
│   ├── pages/           <-- Astro pages like index, posts, og-images, etc.
│   │
│   └── utils/           <-- Utility functions
│
└── astro.config.mjs     <-- Configuration for Astro and plugins
```

---

### Commands

| Command             | Action                                      |
| :------------------ | :------------------------------------------ |
| `pnpm install`      | Installs dependencies                       |
| `pnpm run dev`      | Starts local dev server at `localhost:4321` |
| `pnpm run build`    | Build the production site to `./dist/`      |
| `pnpm run preview`  | Preview the build locally, before deploying |
| `pnpm run prettier` | Format the code                             |
