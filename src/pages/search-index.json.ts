import type { APIRoute } from "astro";
import { getChapters, getLinks, getTopics, url } from "../lib/content";
import { indexFile, readChapterFile, readLinkFile, readTopicFile } from "../lib/search-index";

export const prerender = true;

export const GET: APIRoute = async () => {
  const topics = await getTopics();
  const entries = [];
  for (const topic of topics) {
    const title = topic.data.title;
    entries.push(...indexFile(readTopicFile(topic.id), title, "الغلاف", url(`${topic.id}/`)));
    for (const chapter of await getChapters(topic.id)) {
      entries.push(...indexFile(readChapterFile(chapter.id), title, chapter.data.title, url(`${chapter.id}/`)));
    }
  }
  for (const link of await getLinks()) {
    entries.push(...indexFile(readLinkFile(link.id), "لينكات", link.data.title, url("links/")));
  }
  return new Response(JSON.stringify(entries), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
