import { readdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

const slugs = (dir: string) => readdirSync(`content/${dir}`).map((f) => f.replace(/^\d+\./, "").replace(/\.md$/, ""));
const pages = ["/", "/projects", "/blog", "/contact", "/about", "/resume"];
const routes = [...pages, ...slugs("projects").map((s) => `/projects/${s}`), ...slugs("blog").map((s) => `/blog/${s}`)];
const langs = [
  { lang: "en", prefix: "" },
  { lang: "es", prefix: "/es" },
];
const url = (prefix: string, r: string) => (r === "/" ? prefix || "/" : prefix + r);

for (const { lang, prefix } of langs) {
  test.describe(`mobile 390px [${lang}]`, () => {
    test.use({ viewport: { width: 390, height: 800 } });
    for (const r of pages) {
      test(`${url(prefix, r)} width equals viewport`, async ({ page }) => {
        await page.goto(url(prefix, r));
        await page.waitForLoadState("networkidle");
        const m = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, body: document.body.scrollWidth, inner: window.innerWidth }));
        expect(m.inner).toBe(390);
        expect(m.scroll).toBe(m.inner);
        expect(m.body).toBeLessThanOrEqual(m.inner);
      });
    }
  });

  test.describe(`home [${lang}]`, () => {
    test("has 4 sections and a single #brief", async ({ page }) => {
      await page.goto(url(prefix, "/"));
      await expect(page.locator("[data-home-section]")).toHaveCount(4);
      await expect(page.locator("#brief")).toHaveCount(1);
    });

    test("hero has a contact CTA", async ({ page }) => {
      await page.goto(url(prefix, "/"));
      const cta = page.locator("[data-home-section]").first().locator('a[href$="/contact"]').first();
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute("href", `${prefix}/contact`);
      await expect(cta).toHaveText(lang === "es" ? "Contáctame" : "Contact me");
    });
  });

  test.describe(`routes [${lang}]`, () => {
    for (const r of routes) {
      test(`${url(prefix, r)} renders without 404 or console errors`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
        page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));
        const res = await page.goto(url(prefix, r));
        await page.waitForLoadState("networkidle");
        expect(res?.status()).toBe(200);
        await expect(page.locator("html")).toHaveAttribute("lang", new RegExp(`^${lang}`));
        expect(errors).toEqual([]);
      });
    }
  });
}

test("a real unknown route is a 404", async ({ page }) => {
  const res = await page.goto("/definitely-not-a-page");
  expect(res?.status()).toBe(404);
});
