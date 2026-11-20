# Saeed's Notes

A fast, colorful technical-learning website written in Egyptian Arabic. It turns long-form study notes into structured learning paths with practical examples, diagrams, code samples, checklists, and quizzes.

[Visit the live website](https://saeedkhal.github.io/saeed-notes/)

## Highlights

- Topic-based learning paths split into ordered chapters
- Practical explanations written in approachable Egyptian Arabic
- Interactive checklists with local progress persistence
- Self-assessment quizzes with hidden answers
- Syntax-highlighted code with diff annotations
- Responsive right-to-left layout
- Light and dark themes
- Search, chapter navigation, and automatic tables of contents
- Installable PWA with offline support
- Static output suitable for GitHub Pages

## Technology

- [Astro 7](https://astro.build/) for static site generation
- [MDX](https://mdxjs.com/) for content and interactive components
- [Shiki](https://shiki.style/) for syntax highlighting
- Content Collections with Zod-backed frontmatter validation
- Vanilla HTML, CSS, and JavaScript with no client-side UI framework
- `pnpm` for package management

## Getting Started

### Prerequisites

- Node.js compatible with Astro 7
- `pnpm` 12 or later

### Local development

```bash
git clone https://github.com/saeedkhal/saeed-notes.git
cd saeed-notes
pnpm install
pnpm dev
```

The development server runs at `http://localhost:4321`.

### Production build

```bash
pnpm build
pnpm preview
```

The generated static site is written to `dist/`.

## Project Structure

```text
src/
├── components/          Reusable Astro and MDX components
├── content/
│   ├── topics/          Topic covers and introductions
│   ├── chapters/        Ordered chapters grouped by topic
│   └── links/           Curated saved resources
├── layouts/             Shared page layouts
├── lib/                 Content and PWA utilities
├── pages/               File-based routes
└── styles/              Global and layout styles
public/
└── icons/               Static PWA assets
```

## Adding a Topic

1. Create `src/content/topics/<topic>.mdx`. An existing topic file can be used as a frontmatter reference.
2. Add chapters under `src/content/chapters/<topic>/`.
3. Give every chapter a unique `order`, a display `color`, and a globally unique checklist ID.
4. Run `pnpm build` to validate MDX syntax and content schemas.

The home page, topic map, sidebar, table of contents, and previous/next navigation are generated automatically.

## MDX Components

Content authors can use the following components without importing them:

- `Hl` and `En` for highlights and technical terms
- `Box`, `Grid2`, and `Card` for callouts and comparisons
- `Flow` and `Diagram` for process and architecture visuals
- `File` and `Tree` for source files and directory structures
- `Checklist` for persistent learning checkpoints
- `Quiz` and `Q` for self-assessment
- `Cheat` for compact revision guides
- `ScrollDemo`, `MotionDemo`, and `EaseCanvas` for interactive demos

Markdown-enabled container components such as `Box`, `Card`, `File`, and `Tree` require a blank line after the opening tag and before the closing tag.

## Deployment

Pushes to `main` are built and deployed automatically to GitHub Pages through the repository's GitHub Actions workflow.

The production site uses `/saeed-notes` as its base path. Internal URLs must be created through the shared `url()` helper so they continue to work locally and on GitHub Pages.

## Content Principles

- Explanations are written in original wording rather than copied from source material.
- Technical terms remain in English where that improves accuracy.
- Examples should reflect realistic engineering work and production trade-offs.
- Time-sensitive commands, pricing, and service details should be checked against current official documentation.
