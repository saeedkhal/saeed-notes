import type { APIRoute } from "astro";
import { url } from "../lib/content";

export const prerender = true;

/**
 * صفحة بتظهر لما تفتح صفحة مش محفوظة والنت مقطوع.
 * الـ CSS جوّاها inline عشان متعتمدش على ملفات _astro ممكن تكون مش في الكاش.
 */
export const GET: APIRoute = () => {
  const home = url("/");
  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>مفيش نت · مذكرات سعيد</title>
<link rel="icon" href="${url("favicon.svg")}" type="image/svg+xml" />
<style>
  :root { --bg: #ffffff; --soft: #f7f6fe; --text: #2b2b3a; --muted: #6b6b80; --c1: #6c4bff; --c4: #ff4f8b; }
  @media (prefers-color-scheme: dark) { :root { --bg: #12121f; --soft: #1a1a2c; --text: #e7e7f2; --muted: #a0a0b8; } }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px 16px;
    font-family: Cairo, "Segoe UI", Tahoma, sans-serif; background: var(--bg); color: var(--text); line-height: 1.8; }
  main { width: 100%; max-width: 560px; }
  .card { background: var(--soft); border-radius: 20px; padding: 28px 24px; border-top: 5px solid var(--c4); }
  h1 { margin: 0 0 6px; font-size: 1.6rem; }
  p { margin: 0 0 14px; color: var(--muted); }
  .btn { display: inline-block; background: var(--c1); color: #fff; border: 0; border-radius: 12px;
    padding: 10px 18px; font: inherit; font-weight: 700; cursor: pointer; text-decoration: none; }
  h2 { font-size: 1.05rem; margin: 26px 0 8px; }
  ul { list-style: none; margin: 0; padding: 0; }
  li a { display: block; padding: 8px 12px; border-radius: 10px; color: var(--text); text-decoration: none;
    overflow-wrap: anywhere; }
  li a:hover { background: color-mix(in srgb, var(--c1) 12%, transparent); }
</style>
</head>
<body>
<main>
  <div class="card">
    <h1>📴 النت مقطوع</h1>
    <p>الصفحة دي لسه متحفظتش على جهازك. أي صفحة بتفتحها وإنت أونلاين بتتحفظ لوحدها، فالمرة الجاية هتفتح من غير نت.</p>
    <button class="btn" onclick="location.reload()">جرّب تاني</button>
    <a class="btn" href="${home}" style="background:transparent;color:var(--c1)">الرئيسية</a>
    <h2 id="saved-title" hidden>الصفحات المحفوظة عندك</h2>
    <ul id="saved"></ul>
  </div>
</main>
<script>
  (async () => {
    try {
      const cache = await caches.open("pages-v1");
      const items = [];
      for (const req of await cache.keys()) {
        const res = await cache.match(req);
        const doc = new DOMParser().parseFromString(res ? await res.text() : "", "text/html");
        const title = doc.title.replace(/ · مذكرات سعيد$/, "");
        if (req.url.endsWith("offline.html")) continue;
        items.push({ href: req.url, title: title || new URL(req.url).pathname });
      }
      items.sort((a, b) => a.title.localeCompare(b.title, "ar"));
      const list = document.getElementById("saved");
      for (const { href, title } of items) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = title;
        const li = document.createElement("li");
        li.append(a);
        list.append(li);
      }
      document.getElementById("saved-title").hidden = items.length === 0;
    } catch {}
  })();
</script>
</body>
</html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
