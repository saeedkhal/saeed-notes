import type { APIRoute } from "astro";
import { getChapters, getTopics, url } from "../lib/content";
import { indexFile, readChapterFile, readTopicFile } from "../lib/search-index";

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
  return new Response(JSON.stringify(entries), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
