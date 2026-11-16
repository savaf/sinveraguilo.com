import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ROOT, read } from "./helpers";
import { join } from "node:path";

describe("home is 4 sections + footer", () => {
  const index = read("pages/index.vue");

  it("has exactly 4 section groups", () => {
    expect([...index.matchAll(/data-home-section/g)]).toHaveLength(4);
  });

  it("keeps hero, proof strip, featured, brief", () => {
    for (const c of ["SectionHero", "SharedStatsBar", "SectionImpact", "SectionFeatured", "SectionBriefBuilder"]) expect(index).toContain(`<${c} `);
  });

  it("drops cut sections and the second contact close", () => {
    expect(index).not.toMatch(/SectionManifesto|SectionRail|SectionWriting|SectionFaq|SharedCtaBand|SectionA11yLive|SectionPerfReceipt|SectionLiveDemos|SectionTerminal|SectionTimeOverlap|SectionCareerLog|SectionStackExplorer|SectionFitCheck|SectionProcess/);
  });

  it("no global sticky CTA", () => {
    expect(read("layouts/default.vue")).not.toMatch(/StickyCta/);
    expect(existsSync(join(ROOT, "components/shared/StickyCta.vue"))).toBe(false);
  });

  it("career log, stack explorer, fit check and process are gone", () => {
    for (const c of ["CareerLog", "StackExplorer", "FitCheck", "Process", "Faq"]) expect(existsSync(join(ROOT, `components/section/${c}.vue`))).toBe(false);
  });
});
