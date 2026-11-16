import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT, read, walk } from "./helpers";

// #94: page gadgets cut from 404, blog, resume, about, contact, projects and process.
const cutComponents = [
  "components/shared/BugSquash.vue",
  "components/shared/PostMap.vue",
  "components/shared/TimeLeft.vue",
  "components/shared/ResumeReading.vue",
  "components/shared/ReadAloud.vue",
  "components/shared/QuoteShare.vue",
  "components/shared/ReadFocus.vue",
  "components/about/SkillsHeatmap.vue",
  "components/projects/Constellation.vue",
];
const cutKeyPrefixes = ["squash.", "postMap.", "timeLeft.", "readingResume.", "listen.", "quote.", "focus.", "heatmap.", "lens.", "projects.tech", "projects.showing", "projects.compare", "projects.constellation", "contact.preview", "contact.mailApp", "contact.pv"];
const locales = ["en", "es"] as const;

const flat = (o: any, p = ""): string[] => Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" && !Array.isArray(v) ? flat(v, p + k + ".") : [p + k]));

describe("cut page gadgets", () => {
  it.each(cutComponents)("%s is deleted", (f) => {
    expect(existsSync(join(ROOT, f))).toBe(false);
  });

  it.each(locales)("%s has no i18n keys left for cut gadgets", (l) => {
    const keys = flat(JSON.parse(read(`i18n/locales/${l}.json`)));
    expect(keys.filter((k) => cutKeyPrefixes.some((p) => k.startsWith(p)))).toEqual([]);
  });

  it("404 page has no game", () => {
    expect(read("error.vue")).not.toMatch(/BugSquash/);
  });

  it("resume has no tailor lens, process has no progress bar, contact has no email preview", () => {
    expect(read("pages/resume.vue")).not.toMatch(/lens\.|picked/);
    expect(read("components/contact/Form.vue")).not.toMatch(/mail-preview|contact\.preview/);
  });

  it("projects grid has no tech filters or compare table", () => {
    expect(read("components/projects/Grid.vue")).not.toMatch(/activeTech|techCounts|picked|<table/);
  });

  it("blog post has none of the reading gadgets", () => {
    expect(read("pages/blog/[slug].vue")).not.toMatch(/TimeLeft|ResumeReading|PostMap|ReadAloud|ReadFocus|QuoteShare/);
  });

  it("every page route still exists", () => {
    const pages = walk("pages", [".vue"]);
    for (const p of ["pages/index.vue", "pages/about.vue", "pages/contact.vue", "pages/resume.vue", "pages/blog/index.vue", "pages/blog/[slug].vue", "pages/projects/index.vue", "pages/projects/[slug].vue"]) expect(pages).toContain(p);
  });
});
