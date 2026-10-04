import { getCollection, type CollectionEntry } from "astro:content";

export type Chapter = CollectionEntry<"chapters">;
export type Topic = CollectionEntry<"topics">;

export const url = (path = "") => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
};

/** "monorepo/pnpm" → { topic: "monorepo", slug: "pnpm" } */
export const splitId = (id: string) => {
  const [topic, ...rest] = id.split("/");
  return { topic: topic!, slug: rest.join("/") };
};

export async function getTopics() {
  return (await getCollection("topics")).sort((a, b) => a.data.order - b.data.order);
}

export async function getChapters(topic: string) {
  return (await getCollection("chapters", (c) => splitId(c.id).topic === topic)).sort(
    (a, b) => a.data.order - b.data.order,
  );
}

export const chapterHref = (c: Chapter) => url(`${c.id}/`);
