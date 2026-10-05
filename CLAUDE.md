# مذكرات سعيد (saeed-notes)

A static docs site of colorful technical study notes written in **Egyptian Arabic** (RTL). It is the web version of the "egyptian-study-notes-pdf" style: highlighter markers, colored callout boxes, chapter banners, checklists and quizzes. Each *topic* is a book/subject; each topic has *chapters*.

## Stack & commands

- Astro 7 + `@astrojs/mdx`, static output, no UI framework. **Use pnpm only** (never npm/yarn).
- `pnpm dev` → http://localhost:4321 · `pnpm build` → `dist/` · `pnpm preview`
- Always run `pnpm build` after content or code changes. It catches MDX parse errors and schema errors.

## Layout

```
src/content.config.ts          # schemas for `topics` and `chapters` (zod from astro/zod)
src/content/topics/<topic>.mdx # topic cover: frontmatter + intro body (analogy, "قبل ما تبدأ")
src/content/chapters/<topic>/<slug>.mdx   # one page per chapter → /<topic>/<slug>/
src/components/*.astro         # MDX components, all exported from components/index.ts
src/layouts/Base.astro         # html shell, header, theme toggle, copy-button + mobile menu scripts
src/layouts/Docs.astro         # sidebar (chapters) + main + "في الصفحة دي" TOC
src/pages/index.astro          # home: topic cards
src/pages/[topic]/index.astro  # cover + "الخريطة" timeline (components/Timeline.astro, built from chapters' frontmatter) + topic body
src/pages/[topic]/[chapter].astro  # banner + content + prev/next
src/styles/global.css          # design tokens (light/dark), prose, boxes, markers, code, quiz…
src/styles/layout.css          # header, sidebar, toc, banner, cover, home
src/lib/content.ts             # getTopics/getChapters, url() (respects BASE_URL), splitId
src/lib/rehype-wrap-tables.mjs # wraps <table> in .table-wrap for mobile scroll
src/pwa/sw.js                  # service worker source; src/pages/sw.js.ts fills in base path + build id
src/lib/pwa.ts                 # PWA settings: page cache max age, network timeout, asset limit
src/pages/manifest.webmanifest.ts, offline.html.ts  # PWA manifest + offline fallback (inline CSS)
public/icons/                  # PWA icons (PNG, rendered from favicon.svg)
```

## Adding content

- **New topic:** copy `src/content/topics/monorepo.mdx`. In its frontmatter, `highlight` must be a substring of `title`, because it gets the yellow marker on the cover. Then add chapters under `src/content/chapters/<topic>/`. Nothing else needs registering, because the home page, sidebar, map and pager are all generated.
- **Chapter frontmatter:** `title, short (sidebar), order, label ("فصل ١"), badge ("الأسبوع ١ · فصل ١"), en, keywords (map line), goal, color (c1–c5 | dark), part?`. `part` groups chapters in the topic page's timeline list (e.g. البداية / التطبيق / بعدها). Without it, they fall under one group named after the topic. `keywords` (split on " · ") become the `#tags` there. Rotate colors c1→c5 across chapters. Use Arabic-Indic digits in labels.
- **Chapter shape:** `##` sections. These are auto-numbered with colored badges by CSS counters, so don't number them yourself. Mix in boxes, analogies, code, and a 🧪 Lab. End every chapter with `<Checklist>` then `<Quiz>`. A topic ends with a cheat-sheet chapter that uses `<Cheat>`.

## Writing rules

- Use Egyptian colloquial Arabic in a warm tone. Keep technical terms in English (inline code or `<En>`).
- Write study notes **in your own words**. Never translate or reproduce copyrighted passages, examples or tables from a source book. Use everyday Egyptian analogies (كشري، جرسون، بواب، عمارة…) in `<Box type="story">`.
- Alternate marker colors so a page never looks monotone. Use `<Hl>` sparingly, for the key sentence of a section.
- Code comments may be in Arabic. Keep code itself correct and runnable. Tools change fast, so say "راجع الـ docs" for flags.
- To show a line added or removed, put a Shaku comment on the line before it: `// @diff +` or `// @diff -` (use `#` in bash and `/* */` in CSS). The comment is hidden in the rendered block. A range is `// @diff + start` through `// @diff + end`.

## MDX components (auto-injected, no imports)

`<Hl c="y|p|g|b|o|u">`, `<En>`, `<Box type="idea|warn|tip|story|interview" title icon?>`, `<Grid2><Card title c={1-5}>`, `<Flow items={[{t,s?,c?}, "→", …]} />`, `<Chips items>`, `<File name>` + fenced code, `<Tree>` + ```text fence, `<Checklist id title items>`, `<Quiz><Q n q>answer</Q></Quiz>`, `<Cheat items={[[problem, fix], …]} />`.
- `<Diagram title? height? mheight? nodes={[{id,t,s?,c?,x,y,mx?,my?}]} edges={[{from,to,t?,c?,dash?,bend?,mbend?}]} />` draws a canvas diagram: boxes, arrows with a label on each, and animated dots. `x/y` are percentages of the canvas. `mx/my/mheight` set the layout below 560px (lay it out vertically). Paired arrows (A→B and B→A) need opposite `bend`. Leave room between boxes for the label pill, otherwise it covers them, so check screenshots at 1400px and 390px.

- String props (`items`, `q`) support `` `code` `` and Checklist also supports `**bold**`. These are converted by the component, not by Markdown.
- `Checklist` `id` must be globally unique (`<topic>-w1`…), because it is the localStorage key.

## Gotchas

- **MDX:** leave a blank line after the opening tag and before the closing tag of `Box`/`Card`/`File`/`Tree`, otherwise their content isn't parsed as Markdown. A bare `{` or `<` in prose is parsed as JSX. Put such text in inline code.
- In JSX attributes, use single quotes when the value contains `"` (e.g. `title='ليه "private": true؟'`).
- **Astro 7:** its default Markdown processor (Sätteri) ignores remark/rehype plugins. Plugins only work via `markdown.processor: unified({...})` from `@astrojs/markdown-remark`, which is how the tables plugin is wired in `astro.config.mjs`. Don't move them to `mdx({ rehypePlugins })`, because that is ignored too.
- Shiki theme `one-dark-pro`. Code blocks are forced LTR, and the language pill comes from `pre[data-language]`.
- Theme: tokens on `:root`, dark via `prefers-color-scheme` **and** `[data-theme="dark"]`. When adding colors, update both dark blocks in `global.css`.
- Links: always build them with `url()` from `src/lib/content.ts`, so a GitHub Pages `base` keeps working.
- pnpm blocks dependency build scripts. Allowed ones are listed under `allowBuilds` in `pnpm-workspace.yaml` (currently esbuild).

## Verifying UI changes

Build, run `pnpm preview`, then screenshot desktop (1400px), dark mode, and mobile (390px) with Playwright. Check that `document.documentElement.scrollWidth - innerWidth === 0`, meaning no horizontal page scroll. Long inline code must wrap (`overflow-wrap: anywhere`).

## Offline / PWA

- Pages are cache-first. A cached page is served while it is from the current build and less than `PAGE_MAX_AGE_DAYS` old. Otherwise the network is tried (`NETWORK_TIMEOUT_MS`) and the stale copy is the fallback. An uncached page while offline gets `offline.html`.
- `_astro/*` files are hashed, so they are cached forever (trimmed to `MAX_ASSETS`). Everything else (search index, icons, manifest) is stale-while-revalidate.
- Every build gets a new `BUILD_ID`, so `sw.js` changes and each deploy marks cached pages stale. Don't hardcode the base path in the SW, because it reads it from its scope.
- The SW only registers in production builds. Test offline with `pnpm preview` and then stop the server, because Playwright's `setOffline` doesn't affect service worker fetches.

