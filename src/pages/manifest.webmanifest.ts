import type { APIRoute } from "astro";
import { url } from "../lib/content";
import { BG_COLOR, THEME_COLOR } from "../lib/pwa";

export const prerender = true;

export const GET: APIRoute = () => {
  const manifest = {
    name: "مذكرات سعيد",
    short_name: "مذكرات سعيد",
    description: "مذكرات تقنية ملوّنة بالمصري — بتشتغل من غير نت",
    lang: "ar",
    dir: "rtl",
    id: url("/"),
    start_url: url("/"),
    scope: url("/"),
    display: "standalone",
    background_color: BG_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      { src: url("icons/icon-192.png"), sizes: "192x192", type: "image/png", purpose: "any" },
      { src: url("icons/icon-512.png"), sizes: "512x512", type: "image/png", purpose: "any" },
      { src: url("icons/maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
  });
};
