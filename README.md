# sinveraguilo.com

Personal portfolio for Sinver Aguiló — bio, work experience, education, case studies, and blog.
Built with Nuxt 3, [`@nuxt/content`](https://content.nuxt.com/) v2 for file-based content, [`@nuxtjs/i18n`](https://i18n.nuxtjs.org/) for EN/ES, and Tailwind CSS v4.

## Stack

- **Nuxt 3** + Nitro server
- **`@nuxt/content` v2** — Markdown case studies/posts and JSON data, queried with `queryContent()`
- **`@nuxtjs/i18n`** — `prefix_except_default` strategy (English at bare paths, Spanish under `/es/...`), locale files in `i18n/locales/{en,es}.json`
- **`@nuxt/image`** — on-the-fly WebP for `<NuxtImg>`-rendered images
- **`@nuxtjs/sitemap`** — auto-generated per-locale sitemap with hreflang, content routes sourced from `server/api/__sitemap__/urls.ts`
- **Tailwind CSS v4**

## Content model

Everything under `content/` is either Markdown (long-form: `projects/`, `blog/`) or JSON (structured: `experiences/`, `education/`, `social_links.json`).

### Bilingual JSON fields

`content/experiences/*.json` and `content/education/*.json` are bilingual: any field that needs translation is an object keyed by locale instead of a plain string, e.g.

```json
{
  "company": "Acme Corp",
  "position": { "en": "Frontend Engineer", "es": "Ingeniero Frontend" },
  "description": { "en": ["..."], "es": ["..."] }
}
```

`company` and `skills` stay flat (proper nouns / tech names never need translation). Components resolve the active locale with `useLocalized()` (`utils/i18n.ts`) — call `tr(field)` from the template so it reacts to a locale switch. A plain string/array also passes through untouched, so a file doesn't have to be fully migrated to render correctly.

Experience dates are **not** stored as a string. Use `startDate`/`endDate` (`"YYYY-MM"`, `endDate: null` for a current role) and let `dateLabel()` in `components/about/Experience.vue` compute the localized range and duration via `utils/duration.ts`.

### Markdown content

`content/projects/*.md` and `content/blog/*.md` are English-only for now — the leading number in the filename controls list order. A small notice (`detail.englishOnly` i18n key) is shown to Spanish visitors on those detail pages.

## Development

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build
pnpm preview  # preview the production build locally
pnpm generate # static generation
pnpm lint     # eslint + prettier check
```

## Contact form

`components/contact/Form.vue` posts to `server/api/contact.post.ts`, which sends via [Resend](https://resend.com/). Requires a `RESEND_API_KEY` environment variable and a verified sending domain for the `from` address in that route. `components/contact/Details.vue` keeps a `mailto:` link as a visible fallback.
