# Astro Blog Development Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Environment Setup

### Node.js Version

- **Required**: Node.js 22 (specified in `.nvmrc`)
- **Package Manager**: pnpm 10.15.0 (specified in `package.json`)

## Working Effectively

### Code Quality and Formatting

```bash
# Auto-fix code formatting - ALWAYS run to fix formatting issues
pnpm run prettier
# Takes ~2s to complete, formats all files and updates cache
```

### Available Scripts

```bash
# Type checking and validation
pnpm run prebuild
# Runs astro check - validates TypeScript and generates content types

# Full build process
pnpm run build
# Runs prebuild, then astro build
# Build time varies - NEVER CANCEL. Set timeout to 10+ minutes.

# Development server
pnpm run dev
# Starts dev server at localhost:4321 - NEVER CANCEL
# Server startup takes ~10s, then runs continuously

# Preview built site
pnpm run preview
# Serves built site locally for testing

# Get project information
pnpm run astro info
# Shows: Astro version, Node version, integrations, and system info

# Other useful commands (require PocketBase):
pnpm run astro check          # Type checking and validation
pnpm run astro build          # Build production site
pnpm run astro dev            # Development server
pnpm run astro preview        # Preview built site
pnpm run astro sync           # Generate content types
```

## Validation and Testing

### Content Validation

- This project has no unit tests defined
- Validation relies on TypeScript checking and Astro's content validation
- **ALWAYS** run `pnpm run prettier` before committing changes
- Content is validated against schemas defined in `src/content.config.ts`

### Manual Testing Scenarios

1. **Homepage**: Navigate to `localhost:4321` - verify blog posts load
2. **Posts**: Test `/posts` page - verify post listings display
3. **Individual Posts**: Test dynamic post pages `/posts/[...slug]`
4. **Latest Posts**: Test `/posts/latest` page
5. **Tags**: Test tag-based filtering at `/tags/[tag]`
6. **RSS Feed**: Test `/rss.xml` generation

## Common Tasks and Project Structure

### Project Statistics

- **Source files**: TypeScript/Astro/MDX files
- **Framework**: Astro v5 with Solid.js for interactive components and Tailwind CSS v4 for styling
- **Build output**: Static site generation

### Key Directories

```
src/
├── components/            # Astro and Solid.js components
│   ├── posts/            # Post-specific interactive components
│   ├── Article.astro     # Main article layout component
│   ├── Header.astro      # Site header with navigation
│   ├── Navigation.astro  # Site navigation
│   ├── ThemeToggle.astro # Dark/light mode toggle
│   └── ...
├── content/
│   └── posts/            # Blog posts in MDX format
├── content.config.ts     # Content collections configuration (local files)
├── layouts/              # Page layouts
│   ├── BaseLayout.astro  # Main layout template
│   └── PostLayout.astro  # Blog post layout
├── pages/                # File-based routing
│   ├── index.astro       # Homepage
│   ├── posts/            # Post pages and listings
│   │   ├── [...slug]/    # Dynamic post pages
│   │   ├── index.astro   # Posts listing
│   │   └── latest.astro  # Latest posts page
│   ├── tags/[tag].astro  # Tag-based filtering
│   ├── rss.xml.ts        # RSS feed generation
│   └── og-image.png.ts   # Open Graph image generation
├── assets/
│   └── images/           # Blog post images organized by post
├── styles/               # Global styles (Tailwind CSS)
├── utils/                # Utility functions
│   ├── external-link.ts  # External link processing
│   ├── format-date.ts    # Date formatting utilities
│   ├── og-image.ts       # Open Graph image utilities
│   ├── reading-time.ts   # Reading time calculation
│   └── slugify.ts        # URL slug utilities
└── icons/                # Custom SVG icons

.github/
├── workflows/
│   ├── copilot-setup-steps.yml  # Environment setup for Copilot
│   ├── release.yaml             # Automated releases with semantic-release
│   └── update-dependencies.yaml # Weekly dependency updates
└── copilot-instructions.md      # This file

public/
├── brand/             # Brand assets and favicons
├── fonts/             # Custom fonts
└── images/            # Static images for posts

scripts/
└── update-blog-list.js  # Script to update blog listings
```

### Content Collections (Local Files)

Content is managed locally using Astro's content collections:

- `posts` → Local MDX files in `src/content/posts/`
- Uses glob loader to automatically discover posts
- Schema validation for frontmatter properties

### Key Configuration Files

- `astro.config.mjs` - Main Astro configuration with integrations
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration (extends Astro strict config)
- `.prettierrc` - Code formatting rules (with plugins)
- `pnpm-lock.yaml` - Dependency lockfile
- `.nvmrc` - Node.js version specification (v22)

### Astro Integrations Used

Based on `astro.config.mjs`:

- **astro-meta-tags** - SEO meta tags management
- **astro-icon** - Icon system integration
- **astro-matomo** - Analytics integration (Matomo)
- **astro-robots-txt** - robots.txt generation
- **@astrojs/sitemap** - Sitemap generation
- **@astrojs/solid-js** - Solid.js integration for reactive components
- **@astrojs/mdx** - MDX support for blog posts
- **@astrojs/rss** - RSS feed generation

### Tech Stack

- **Frontend**: Astro 5 (static site generator)
- **Interactive Components**: Solid.js
- **Styling**: Tailwind CSS 4
- **Content**: MDX files with frontmatter
- **Icons**: Heroicons, Simple Icons
- **Analytics**: Matomo
- **Package Manager**: pnpm
- **Node**: v22

## Deployment and CI/CD

### GitHub Actions Workflow

The project uses automated deployment via `.github/workflows/release.yaml`:

1. **Triggers**: Push to `master` or `staging` branches
2. **Steps**: Install → Format Check → Astro Check → Semantic Release
3. **Environment**: Requires Matomo environment variables for analytics
4. **Release**: Uses semantic-release for automated versioning

### Preview Deployment

This repository is connected to Vercel for preview deployments.
When you create a commit, **make sure to include the `[deploy]` tag in your commit message**.

### Release Process

- Uses conventional commits for automated versioning
- Releases are automated through semantic-release
- Updates are published to the website automatically on new releases

## Content Management

### Blog Post Structure

Blog posts are written in MDX format with frontmatter:

```yaml
---
title: "Post Title"
description: "Post description for SEO"
image: "/images/post-image.webp" # Optional
pubDate: 2024-01-01
modDate: 2024-01-02 # Optional
color: "#4472c4" # Optional, defaults to blue
author: "Luis Wolf" # Optional, defaults to Luis Wolf
tags: ["tag1", "tag2"] # Optional
---
# Post content in MDX
```

### Adding New Posts

1. Create new `.mdx` file in `src/content/posts/`
2. Add required frontmatter (title, description, pubDate)
3. Write content using MDX syntax
4. Add images to `src/assets/images/[post-folder]/` if needed

### Image Management

- Post images are stored in `src/assets/images/[post-name]/`
- Astro automatically optimizes images during build

## Special Features

### Open Graph Images

- Automatic OG image generation for posts using Satori
- Generated at `/posts/[...slug]/og-image.png`
- Also available for homepage at `/og-image.png`

### RSS Feed

- Automatically generated RSS feed at `/rss.xml`
- Includes all published posts with full content
- Uses post descriptions and publication dates

### Reading Time

- Automatic reading time calculation for posts
- Displayed in post headers and listings
- Calculated using word count and average reading speed

### External Link Processing

- Automatic external link detection and styling
- Adds appropriate `rel` attributes for SEO
- Opens external links in new tabs

### Theme Support

- Dark/light mode toggle
- Respects user's system preference
- Persistent theme selection using localStorage

## Troubleshooting

### Build Failures

- Check that all MDX files have valid frontmatter
- Verify image paths are correct and files exist
- Ensure TypeScript types are valid

### Development Server Issues

- Server starts without external dependencies
- All content is local - no external API calls needed
- Clear Astro cache if experiencing issues: `rm -rf .astro`

## Important Notes

- **NEVER CANCEL** long-running commands (builds, installs) - wait for completion
- This is a static site generator with local content files
- All blog content is managed through MDX files in the repository
- Project uses Astro v5 with Solid.js for interactive components
- Uses Tailwind CSS v4 for styling
- Integrates with Matomo for analytics
