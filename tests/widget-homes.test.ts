import { describe, expect, it } from "vitest";
import { read } from "./helpers";

// #97: each moved widget lives on exactly one page.
const homes: Record<string, string[]> = {
  "pages/colophon.vue": ["SectionA11yLive", "SectionPerfReceipt"],
  "pages/about.vue": ["SectionTerminal"],
  "pages/projects/[slug].vue": ["SectionLiveDemos"],
  "pages/contact.vue": ["SectionTimeOverlap"],
};

describe("widgets live on their destination page", () => {
  it.each(Object.entries(homes))("%s renders %j", (page, comps) => {
    for (const c of comps) expect(read(page)).toMatch(new RegExp(`<${c}[\\s/>]`));
  });

  it("no other page renders them", () => {
    const all = Object.values(homes).flat();
    for (const page of ["pages/index.vue", "pages/resume.vue", "pages/projects/index.vue", "pages/blog/index.vue", "pages/blog/[slug].vue"]) {
      for (const c of all) expect(read(page)).not.toContain(`<${c}`);
    }
  });

  it("project page has an inline CTA and no sticky one", () => {
    const p = read("pages/projects/[slug].vue");
    expect(p).toMatch(/SharedCtaBand|ProjectsSimilarCta/);
    expect(p).not.toMatch(/sticky-cta|StickyCta|fixed bottom/i);
  });

  it("PENDING_MOVE is gone", () => {
    expect(read("tests/components.test.ts")).not.toMatch(/PENDING_MOVE/);
  });
});
