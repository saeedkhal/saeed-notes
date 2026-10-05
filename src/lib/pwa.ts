/** إعدادات الـ PWA المشتركة بين الـ service worker والـ manifest وصفحة الـ offline */

/** بيتغير مع كل build، فالـ service worker يعرف إن في نسخة جديدة من الموقع */
export const BUILD_ID = process.env.GITHUB_SHA?.slice(0, 12) ?? Date.now().toString(36);

/** الصفحة بتفضل "طازة" ٧ أيام أو لحد أول deploy جديد، أيهما أقرب */
export const PAGE_MAX_AGE_DAYS = 7;

/** لو الصفحة قديمة والنت بطيء، نستنى الشبكة الوقت ده بس وبعدين نرجّع النسخة المحفوظة */
export const NETWORK_TIMEOUT_MS = 4000;

/** أقصى عدد ملفات _astro (CSS و JS و fonts) نحتفظ بيها، عشان builds قديمة متتراكمش */
export const MAX_ASSETS = 200;

export const THEME_COLOR = "#6c4bff";
export const BG_COLOR = "#12121f";
