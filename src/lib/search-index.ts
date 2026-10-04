import fs from "node:fs";
import path from "node:path";

export interface SearchEntry {
  topic: string;
  where: string;
  href: string;
  text: string;
}

const MIN = 16;

function pushSentence(out: string[], raw: string) {
  const text = raw
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .replace(/^#+\s*/, "")
    .trim();
  if (text.length < MIN || text.length > 320) return;
  if (!/[\u0600-\u06FFa-zA-Z]{3}/.test(text)) return;
  if (/^[-|:.\s]+$/.test(text)) return;
  if (/[<>{}]/.test(text)) return;
  out.push(text);
}

/** يطلع الجمل الظاهرة من ملف MDX عشان البحث يلاقيها في الصفحة. */
export function sentencesFromMdx(raw: string): string[] {
  const body = raw.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const src = body.replace(/```[\s\S]*?```/g, "\n");
  const out: string[] = [];

  for (const m of src.matchAll(/\b(?:title|q|label)\s*=\s*(?:"([^"]+)"|'([^']+)')/g)) {
    pushSentence(out, m[1] || m[2] || "");
  }
  for (const m of src.matchAll(/"([^"\n\\]{16,300})"/g)) {
    pushSentence(out, m[1]);
  }
  for (const m of src.matchAll(/\b[ts]\s*:\s*"([^"\n]{8,200})"/g)) {
    pushSentence(out, m[1]);
  }

  let text = src.replace(/<[^>]+>/g, "");
  text = text.replace(/\{[^{}]*\}/g, " ");
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  text = text.replace(/`([^`]+)`/g, "$1");
  text = text.replace(/[*_~]+/g, "");
  text = text.replace(/^#+\s*/gm, "");
  text = text.replace(/^\s*\d+\.\s+/gm, "");

  for (const block of text.split(/\n{2,}/)) {
    const line = block.replace(/\s+/g, " ").trim();
    if (!line) continue;
    if (line.includes("|")) {
      for (const cell of line.split("|")) pushSentence(out, cell);
      continue;
    }
    const parts = line.split(/(?<=[.؟!])\s+/);
    if (parts.length === 1) pushSentence(out, line);
    else for (const part of parts) pushSentence(out, part);
  }

  const seen = new Set<string>();
  return out.filter((s) => {
    const key = s.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function field(raw: string, key: string) {
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return "";
  const m = fm[1].match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  if (!m) return "";
  return m[1]
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1");
}

function readContent(rel: string) {
  return fs.readFileSync(path.join(process.cwd(), "src/content", rel), "utf8");
}

export function indexFile(raw: string, topic: string, where: string, href: string): SearchEntry[] {
  const extra = [field(raw, "title"), field(raw, "goal"), field(raw, "subtitle"), field(raw, "en")]
    .flatMap((s) => s.split("·").map((x) => x.trim()));
  const texts = [...extra, ...sentencesFromMdx(raw)];
  const seen = new Set<string>();
  const entries: SearchEntry[] = [];
  for (const text of texts) {
    const clean = text.replace(/\s+/g, " ").trim();
    if (clean.length < MIN) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const needle = clean.slice(0, 160);
    entries.push({
      topic,
      where,
      text: clean,
      href: `${href}?hl=${encodeURIComponent(needle)}`,
    });
  }
  return entries.filter((e) => !entries.some((o) => o.text.length > e.text.length && o.text.includes(e.text)));
}

export function readTopicFile(id: string) {
  return readContent(`topics/${id}.mdx`);
}

export function readChapterFile(id: string) {
  return readContent(`chapters/${id}.mdx`);
}
