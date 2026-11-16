import { expect, test } from "@playwright/test";

const widths = [1280, 1024];
const langs = [
  { path: "/", contact: /^contact$/i },
  { path: "/es", contact: /^contacto$/i },
];

for (const { path, contact } of langs) {
  for (const width of widths) {
    test.describe(`header ${path} @ ${width}px`, () => {
      test.use({ viewport: { width, height: 800 } });

      test("fits without horizontal overflow", async ({ page }) => {
        await page.goto(path);
        const m = await page.evaluate(() => {
          const nav = document.querySelector("header.sticky nav")!;
          const last = [...nav.querySelectorAll("a,button")].filter((e) => (e as HTMLElement).offsetParent).pop()!;
          return { scroll: document.documentElement.scrollWidth, inner: window.innerWidth, navScroll: nav.scrollWidth, navClient: nav.clientWidth, lastRight: last.getBoundingClientRect().right };
        });
        expect(m.scroll).toBeLessThanOrEqual(m.inner);
        expect(m.navScroll).toBeLessThanOrEqual(m.navClient);
        expect(m.lastRight).toBeLessThanOrEqual(m.inner);
      });

      test("has at most 8 controls and a visible Contact button", async ({ page }) => {
        await page.goto(path);
        const controls = page.getByRole("banner").locator("a:visible, button:visible");
        expect(await controls.count()).toBeLessThanOrEqual(8);
        const btn = page.getByRole("banner").getByRole("link", { name: contact });
        await expect(btn).toBeVisible();
        await expect(btn).toHaveAttribute("href", /\/contact$/);
      });

      test("logo is not clipped", async ({ page }) => {
        await page.goto(path);
        const logo = page.getByRole("banner").locator("img").first();
        await expect(logo).toBeVisible();
        const r = await logo.evaluate((el: HTMLImageElement) => {
          const b = el.getBoundingClientRect();
          const p = el.closest("a")!.getBoundingClientRect();
          return { w: b.width, h: b.height, ratio: el.naturalWidth / el.naturalHeight, left: b.left, right: b.right, pr: p.right };
        });
        expect(r.w).toBeGreaterThanOrEqual(36);
        expect(Math.abs(r.w / r.h - r.ratio)).toBeLessThan(0.1);
        expect(r.left).toBeGreaterThanOrEqual(0);
        expect(r.right).toBeLessThanOrEqual(r.pr + 0.5);
      });
    });
  }
}
