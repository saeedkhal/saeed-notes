import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { topicTagIds } from "./lib/tags";

const color = z.enum(["c1", "c2", "c3", "c4", "c5", "dark"]);

/** كل موضوع (كتاب) = صفحة غلاف + خريطة */
const topics = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/topics" }),
  schema: z.object({
    title: z.string(),
    highlight: z.string(), // الجزء اللي عليه الماركر الأصفر في العنوان
    subtitle: z.string(),
    tag: z.string().default("📦 مذكرة ملوّنة — بالمصري"),
    description: z.string(),
    emoji: z.string().default("📘"),
    order: z.number().default(0),
    note: z.string().optional(),
    tags: z.array(z.enum(topicTagIds)).default([]),
  }),
});

/** فصول كل موضوع: src/content/chapters/<topic>/<chapter>.mdx */
const chapters = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/chapters" }),
  schema: z.object({
    title: z.string(),
    short: z.string(), // اسم قصير للـ sidebar
    order: z.number(),
    badge: z.string(), // "الأسبوع ١ · فصل ١"
    label: z.string(), // "فصل ١"
    en: z.string(), // سطر الكلمات المفتاحية بالإنجليزي
    goal: z.string().optional(),
    keywords: z.string().optional(), // للخريطة: "workspace:* · symlinks · store"
    color: color.default("c1"),
    part: z.string().optional(), // مجموعة في الـ timeline (البداية/التطبيق…)
  }),
});

export const collections = { topics, chapters };
