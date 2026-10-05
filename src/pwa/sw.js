/**
 * Service worker بتاع مذكرات سعيد.
 * القيم اللي بين __ بتتحط وقت الـ build من src/pages/sw.js.ts.
 *
 * الصفحات:  cache-first. لو لقيناها في الكاش وهي "طازة" نرجّعها على طول.
 *           لو مش موجودة نجيبها من النت ونحفظها. ولو قديمة نجرّب النت،
 *           ولو النت مش موجود نرجّع النسخة القديمة.
 * _astro/:  الملفات اسمها فيه hash، فمبتتغيرش: cache-first من غير مدة.
 * الباقي:   stale-while-revalidate (الـ search index والأيقونات والـ manifest).
 */
const BUILD = "__BUILD__";
const PAGE_MAX_AGE = __PAGE_MAX_AGE_MS__;
const NETWORK_TIMEOUT = __NETWORK_TIMEOUT_MS__;
const MAX_ASSETS = __MAX_ASSETS__;
const SHELL_FILES = __SHELL_FILES__;

const BASE = new URL(self.registration.scope).pathname;
const OFFLINE_URL = BASE + "offline.html";
const PAGES = "pages-v1";
const ASSETS = "assets-v1";
const STATIC = "static-v1";
const SHELL = "shell-" + BUILD;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = [SHELL, PAGES, ASSETS, STATIC];
      for (const key of await caches.keys()) {
        if (!keep.includes(key)) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  if (url.pathname === BASE + "sw.js") return;

  if (url.pathname.startsWith(BASE + "_astro/")) {
    event.respondWith(cacheFirstForever(event, req));
  } else if (isPage(req, url)) {
    event.respondWith(page(event, req, url));
  } else {
    event.respondWith(staleWhileRevalidate(event, req));
  }
});

function isPage(req, url) {
  if (req.mode === "navigate" || req.destination === "document") return true;
  const last = url.pathname.split("/").pop();
  return url.pathname.endsWith("/") || last.endsWith(".html") || !last.includes(".");
}

/** الصفحة تعتبر طازة لو من نفس الـ build ولسه مكملتش PAGE_MAX_AGE */
function isFresh(res) {
  if (res.headers.get("x-sw-build") !== BUILD) return false;
  const at = Number(res.headers.get("x-sw-cached-at"));
  return Date.now() - at < PAGE_MAX_AGE;
}

/** نسخة من الرد عليها وقت الحفظ ورقم الـ build (ومش redirected عشان تنفع للـ navigation) */
async function stamp(res) {
  const headers = new Headers(res.headers);
  headers.set("x-sw-cached-at", String(Date.now()));
  headers.set("x-sw-build", BUILD);
  return new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers });
}

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
}

async function page(event, req, url) {
  // ?hl= بتاع البحث مش بيغيّر الصفحة، فالمفتاح من غير query
  const key = url.origin + url.pathname;
  const cache = await caches.open(PAGES);
  const cached = await cache.match(key);
  if (cached && isFresh(cached)) return cached;

  const network = fetch(req).then(async (res) => {
    if (!res.ok || res.type !== "basic") return res;
    const copy = await stamp(res);
    await cache.put(key, copy.clone());
    return copy;
  });

  try {
    // لو عندنا نسخة قديمة، منستناش النت أكتر من NETWORK_TIMEOUT
    return cached ? await Promise.race([network, timeout(NETWORK_TIMEOUT)]) : await network;
  } catch {
    if (cached) {
      event.waitUntil(network.catch(() => {})); // يكمّل يحدّث في الخلفية لو النت رجع
      return cached;
    }
    return (await caches.match(OFFLINE_URL)) ?? Response.error();
  }
}

async function cacheFirstForever(event, req) {
  const cache = await caches.open(ASSETS);
  const cached = await cache.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  if (res.ok) {
    event.waitUntil(cache.put(req, res.clone()).then(() => trim(cache, MAX_ASSETS)));
  }
  return res;
}

async function staleWhileRevalidate(event, req) {
  const cache = await caches.open(STATIC);
  const cached = (await cache.match(req)) ?? (await caches.match(req));
  const network = fetch(req).then(async (res) => {
    if (res.ok) await cache.put(req, res.clone());
    return res;
  });
  if (cached) {
    event.waitUntil(network.catch(() => {}));
    return cached;
  }
  return network;
}

/** بيمسح الأقدم (أول اللي اتحفظ) لحد ما العدد يبقى max */
async function trim(cache, max) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}
