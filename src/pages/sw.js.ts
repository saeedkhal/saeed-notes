import type { APIRoute } from "astro";
import swSource from "../pwa/sw.js?raw";
import { url } from "../lib/content";
import { BUILD_ID, MAX_ASSETS, NETWORK_TIMEOUT_MS, PAGE_MAX_AGE_DAYS } from "../lib/pwa";

export const prerender = true;

/** ملفات بتتحفظ أول ما الـ service worker يتسطّب */
const SHELL_FILES = [
  "offline.html",
  "manifest.webmanifest",
  "favicon.svg",
  "icons/icon-192.png",
].map((p) => url(p));

export const GET: APIRoute = () => {
  const body = swSource
    .replace("__BUILD__", BUILD_ID)
    .replace("__PAGE_MAX_AGE_MS__", String(PAGE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000))
    .replace("__NETWORK_TIMEOUT_MS__", String(NETWORK_TIMEOUT_MS))
    .replace("__MAX_ASSETS__", String(MAX_ASSETS))
    .replace("__SHELL_FILES__", JSON.stringify(SHELL_FILES));
  return new Response(body, { headers: { "Content-Type": "text/javascript; charset=utf-8" } });
};
