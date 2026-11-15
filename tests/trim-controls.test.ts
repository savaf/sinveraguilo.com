import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT, read } from "./helpers";

// #96 / #98: decorative controls cut; keyboard shortcuts live in the command palette.
const cutComponents = ["components/shared/PageCurtain.vue", "components/shared/Shortcuts.vue"];
const cutKeyPrefixes = ["paper.", "spotlight.", "rain.", "accent.", "tldr.", "blueprint.", "projects.view", "colophon.features.accent", "colophon.features.curtain", "colophon.features.share", "shortcuts.paper", "shortcuts.spotlight", "shortcuts.rain", "shortcuts.help", "shortcuts.close", "shortcuts.title", "shortcuts.goto", "shortcuts.more"];
const flat = (o: any, p = ""): string[] => Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" && !Array.isArray(v) ? flat(v, p + k + ".") : [p + k]));

describe("cut controls (#96)", () => {
  it.each(cutComponents)("%s is deleted", (f) => expect(existsSync(join(ROOT, f))).toBe(false));

  it.each(["en", "es"])("%s has no i18n keys for cut controls", (l) => {
    const keys = flat(JSON.parse(read(`i18n/locales/${l}.json`)));
    expect(keys.filter((k) => cutKeyPrefixes.some((p) => k.startsWith(p)))).toEqual([]);
  });

  it("layout has no curtain or shortcuts sheet", () => {
    expect(read("layouts/default.vue")).not.toMatch(/PageCurtain|Shortcuts/);
  });

  it("project card has no tilt or glare", () => {
    expect(read("components/projects/Card.vue")).not.toMatch(/tilt|glare|--rx|--ry|onMove|onLeave/i);
  });

  it("projects grid has no cards/index toggle", () => {
    expect(read("components/projects/Grid.vue")).not.toMatch(/projects\.view|view\.value|view ===|\.row\b|\.arrow\b/);
  });

  it("no orphan accent or paper styles and scripts", () => {
    expect(read("assets/styles/main.css")).not.toMatch(/data-accent|data-paper/);
    expect(read("nuxt.config.ts")).not.toMatch(/data-paper|'paper'/);
  });
});

describe("command palette absorbs shortcuts (#98)", () => {
  const palette = read("components/shared/CommandPalette.vue");
  it("lists blueprint and the go-to key sequences", () => {
    expect(palette).toMatch(/blueprint:toggle/);
    expect(palette).toMatch(/keys/);
  });
  it("g-prefix navigation lives in the palette and never toggles a mode", () => {
    expect(palette).toMatch(/"g"/);
    expect(palette).toMatch(/stopImmediatePropagation/);
    expect(palette).not.toMatch(/paper|spotlight|rain/i);
  });
  it("resume lives in the pages list, no duplicate route or resumeKey", () => {
    expect(palette).not.toMatch(/resumeKey|"\/resume"[^\n]*navigateTo/);
    expect(palette).toMatch(/to: "\/resume", gKey: "r"/);
  });
  it("blueprint label lives under palette.*", () => {
    expect(palette).toMatch(/palette\.blueprint/);
    expect(palette).not.toMatch(/shortcuts\./);
  });
});
