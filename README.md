# 📦 مذكرات سعيد

موقع docs ستاتيك (Astro + MDX) لمذكرات تقنية ملوّنة بالمصري — نفس ستايل الـ PDF بس كموقع.

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # الناتج في dist/ — ارفعه على أي static host
```

## إضافة موضوع جديد

1. اعمل ملف الغلاف: `src/content/topics/<topic>.mdx` (انسخ `monorepo.mdx` وغيّر الـ frontmatter).
2. حط الفصول في `src/content/chapters/<topic>/*.mdx` — الترتيب بـ `order`، واللون بـ `color` (`c1`…`c5` أو `dark`).
3. خلاص — الصفحة الرئيسية والـ sidebar والخريطة والـ prev/next بيتعملوا أوتوماتيك.

## الـ components المتاحة جوه الـ MDX (من غير import)

| Component | الاستخدام |
| --- | --- |
| `<Hl c="y">…</Hl>` | ماركر: `y` `p` `g` `b` `o` أو `u` (خط بنفسجي) |
| `<En>…</En>` | chip لمصطلح إنجليزي |
| `<Box type="idea" title="…">` | صندوق: `idea` 💡 `warn` 🚨 `tip` ✅ `story` 🍽️ `interview` 🎯 (و`icon` اختياري) |
| `<Flow items={[{t, s, c}, "→", …]} />` | دياجرام أسهم |
| `<Grid2><Card title c={1}>…</Card></Grid2>` | مقارنة عمودين |
| `<Chips items={[…]} />` | كلمات مفتاحية |
| `<File name="…">` + code block | كود عليه اسم الملف |
| `<Tree>` + code block | شجرة فولدرات |
| `<Checklist id title items={[…]} />` | checklist تفاعلية بتتحفظ في المتصفح |
| `<Quiz><Q n={1} q="…">الإجابة</Q></Quiz>` | اختبر نفسك (الإجابة مستخبية) |
| `<Cheat items={[["المشكلة","الحل"], …]} />` | Cheat sheet |

> سيب سطر فاضي جوه الـ components اللي فيها markdown (Box/Card/File/Tree) عشان الـ MDX يقرا اللي جواها كـ markdown.

## النشر على GitHub Pages

حط `site` و `base` في `astro.config.mjs` — كل اللينكات بتستخدم `BASE_URL` فهتشتغل.
