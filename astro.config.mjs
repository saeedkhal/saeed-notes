// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import rehypeWrapTables from "./src/lib/rehype-wrap-tables.mjs";

export default defineConfig({
  // لو هترفعه على GitHub Pages: حط site و base هنا
  // site: "https://username.github.io",
  // base: "/masry-notes",
  integrations: [mdx()],
  markdown: {
    processor: unified({ rehypePlugins: [rehypeWrapTables] }),
    shikiConfig: { theme: "one-dark-pro", wrap: false },
  },
});
