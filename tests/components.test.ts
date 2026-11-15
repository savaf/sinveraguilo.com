import { describe, expect, it } from "vitest";
import { read, walk } from "./helpers";

const vue = [...walk("components", [".vue"]), ...walk("pages", [".vue"]), ...walk("layouts", [".vue"])];

describe("global listeners are cleaned up", () => {
  // Every window/document addEventListener must have a matching removeEventListener
  // for the same target + event, or it leaks across client-side navigation.
  it.each(vue)("%s", (f) => {
    const src = read(f);
    const add = [...src.matchAll(/\b(window|document)\.addEventListener\(\s*["'`](\w+)["'`]/g)].map((m) => `${m[1]}:${m[2]}`);
    const rem = [...src.matchAll(/\b(window|document)\.removeEventListener\(\s*["'`](\w+)["'`]/g)].map((m) => `${m[1]}:${m[2]}`);
    const leaked = add.filter((a) => !rem.includes(a));
    expect(leaked).toEqual([]);
  });

  it.each(vue)("%s clears every setInterval it starts", (f) => {
    const src = read(f);
    if (/setInterval\(/.test(src)) expect(src).toMatch(/clearInterval\(/);
  });
});

describe("css rules that break position: fixed UI", () => {
  const css = walk("assets", [".css"]).map((f) => read(f)).join("\n");
  it("no filter/transform/perspective on body (becomes containing block for fixed elements)", () => {
    const bodyRules = [...css.matchAll(/(?:^|[}\s,])((?:html[^{,]*\s)?body)\s*\{([^}]*)\}/g)];
    const bad = bodyRules.filter(([, , decl]) => /(^|;|\s)(filter|transform|perspective|backdrop-filter)\s*:/.test(decl)).map(([m]) => m.trim());
    expect(bad).toEqual([]);
  });
  it("no selector repeats the same :root attribute (never matches)", () => {
    expect(css).not.toMatch(/(:root\[[^\]]+\])\s+\1/);
  });
});

describe("components are used", () => {
  const all = [...vue, ...walk("components", [".vue"])];
  const haystack = [...new Set(all)].map((f) => read(f)).join("\n") + read("app.vue") + read("error.vue");
  const comps = walk("components", [".vue"]).filter((f) => !f.startsWith("components/content/"));
  it("no dead components (auto-import name never referenced)", () => {
    const dead = comps.filter((f) => {
      const parts = f.replace(/^components\//, "").replace(/\.vue$/, "").split("/");
      const pascal = (s: string) => s.replace(/(^|[-_])(\w)/g, (_, __, c) => c.toUpperCase());
      let name = parts.map(pascal).join("");
      const last = pascal(parts[parts.length - 1]);
      const dir = parts.slice(0, -1).map(pascal).join("");
      if (dir && last.startsWith(dir)) name = last; // Nuxt dedupes a repeated directory prefix
      const kebab = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
      return !new RegExp(`<(Lazy)?${name}[\\s/>]|<(lazy-)?${kebab}[\\s/>]`).test(haystack);
    });
    expect(dead).toEqual([]);
  });
});

describe("internal links point at real pages", () => {
  const pages = new Set(walk("pages", [".vue"]).map((f) => "/" + f.replace(/^pages\//, "").replace(/\.vue$/, "").replace(/\/index$/, "").replace(/^index$/, "")));
  const exists = (p: string) => pages.has(p === "" ? "/" : p) || [...pages].some((x) => x.includes("[") && p.split("/")[1] === x.split("/")[1] && p.split("/").length === x.split("/").length);
  it("every literal localePath('/x') resolves", () => {
    const bad: string[] = [];
    for (const f of vue) for (const m of read(f).matchAll(/localePath\(\s*["'`](\/[^"'`$#?]*)["'`]/g)) if (!exists(m[1].replace(/\/$/, ""))) bad.push(`${m[1]} (${f})`);
    expect(bad).toEqual([]);
  });
  it("blog and project cards link through localePath", () => {
    const bad = walk("pages", [".vue"]).filter((f) => /:to="`\/(blog|projects)\//.test(read(f)));
    expect(bad).toEqual([]);
  });
});
