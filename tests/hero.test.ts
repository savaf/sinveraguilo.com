import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ROOT, read } from "./helpers";
import { join } from "node:path";

describe("home hero", () => {
  const hero = read("components/section/Hero.vue");
  const index = read("pages/index.vue");

  it("has a primary contact CTA", () => {
    expect(hero).toMatch(/localePath\(\s*["']\/contact["']\s*\)/);
    expect(hero).toContain("hero.ctaContact");
  });

  it("has no cursor-grid, name decode or marquee", () => {
    expect(hero).not.toMatch(/grid-glow|moveGrid|leaveGrid|pool\[|requestAnimationFrame/);
    expect(existsSync(join(ROOT, "components/section/Marquee.vue"))).toBe(false);
    expect(index).not.toMatch(/SectionMarquee/);
  });

  it("merges Intent into the hero (no separate section)", () => {
    expect(existsSync(join(ROOT, "components/section/Intent.vue"))).toBe(false);
    expect(index).not.toMatch(/SectionIntent/);
  });
});
