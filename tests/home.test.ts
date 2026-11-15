import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ROOT, read } from "./helpers";
import { join } from "node:path";

describe("home is 7 sections + footer", () => {
  const index = read("pages/index.vue");

  it("has exactly 7 section groups", () => {
    expect([...index.matchAll(/data-home-section/g)]).toHaveLength(7);
  });

  it("keeps hero, proof strip, featured, career log, stack + fit check, process, brief", () => {
    for (const c of ["SectionHero", "SharedStatsBar", "SectionImpact", "SectionFeatured", "SectionCareerLog", "SectionStackExplorer", "SectionFitCheck", "SectionProcess", "SectionBriefBuilder"]) expect(index).toContain(`<${c} `);
  });

  it("drops cut sections and the second contact close", () => {
    expect(index).not.toMatch(/SectionManifesto|SectionRail|SectionWriting|SectionFaq|SharedCtaBand|SectionA11yLive|SectionPerfReceipt|SectionLiveDemos|SectionTerminal|SectionTimeOverlap/);
  });

  it("no global sticky CTA", () => {
    expect(read("layouts/default.vue")).not.toMatch(/StickyCta/);
    expect(existsSync(join(ROOT, "components/shared/StickyCta.vue"))).toBe(false);
  });

  it("FAQ is folded into Process with 3 questions", () => {
    expect(existsSync(join(ROOT, "components/section/Faq.vue"))).toBe(false);
    expect(read("components/section/Process.vue")).toMatch(/faq\.items/);
    for (const l of ["en", "es"]) expect(JSON.parse(read(`i18n/locales/${l}.json`)).faq.items).toHaveLength(3);
  });
});
