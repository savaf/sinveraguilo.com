import { describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import { join } from "node:path";

// Run against a live server:  SMOKE_URL=http://localhost:3000 pnpm test
const BASE = process.env.SMOKE_URL;
const slugs = (dir: string) => readdirSync(join(__dirname, "..", "content", dir)).map((f) => f.replace(/^\d+\./, "").replace(/\.md$/, ""));
const routes = ["/", "/about", "/projects", "/blog", "/contact", "/resume", ...slugs("projects").map((s) => `/projects/${s}`), ...slugs("blog").map((s) => `/blog/${s}`)];
const cases = routes.flatMap((r) => [{ url: r, lang: "en" }, { url: r === "/" ? "/es" : `/es${r}`, lang: "es" }]);

describe.skipIf(!BASE)("smoke: every route renders", () => {
  it.each(cases)("$url", async ({ url, lang }) => {
    const res = await fetch(BASE + url);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toMatch(new RegExp(`<html[^>]*lang="${lang}`));
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    expect(title.length).toBeGreaterThan(0);
    expect((title.match(/Sinver Aguil/g) || []).length).toBeLessThanOrEqual(1); // no doubled site name
    expect(html).not.toMatch(/Not found '[^']+' key/);
    expect(html).not.toMatch(/\b(contact|resume|readingResume|terminal|palette)\.[a-zA-Z.]+\b(?=<)/); // raw i18n keys leaking into the page
  });
  it("unknown route returns 404", async () => {
    expect((await fetch(BASE + "/definitely-not-a-page")).status).toBe(404);
  });
});
