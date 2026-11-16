import { describe, expect, it } from "vitest";
import { duplicateKeys, flatten, read, walk } from "./helpers";

const locales = ["en", "es"] as const;
const raw = Object.fromEntries(locales.map((l) => [l, read(`i18n/locales/${l}.json`)]));
const flat = Object.fromEntries(locales.map((l) => [l, flatten(JSON.parse(raw[l]))]));

describe("i18n locale files", () => {
  it.each(locales)("%s has no duplicate JSON keys (last one silently wins)", (l) => {
    expect(duplicateKeys(raw[l])).toEqual([]);
  });

  it("en and es define exactly the same keys", () => {
    const en = Object.keys(flat.en);
    const es = Object.keys(flat.es);
    expect(en.filter((k) => !(k in flat.es))).toEqual([]);
    expect(es.filter((k) => !(k in flat.en))).toEqual([]);
  });

  it.each(locales)("%s messages have no characters vue-i18n parses as syntax", (l) => {
    const bad: string[] = [];
    for (const [k, v] of Object.entries(flat[l])) {
      if (typeof v !== "string") continue;
      const t = v.replace(/\{'[^']*'\}/g, "").replace(/\{[A-Za-z_][\w.]*\}/g, "");
      if (/[@<>$]|[{}]/.test(t)) bad.push(`${k}: ${v}`);
      if (t.includes("|") && !/^experience\.(years|months)$/.test(k)) bad.push(`${k}: unexpected "|"`);
    }
    expect(bad).toEqual([]);
  });

  it.each(locales)("%s has no empty messages", (l) => {
    const empty = Object.entries(flat[l]).filter(([, v]) => v === "").map(([k]) => k);
    expect(empty).toEqual([]);
  });

  // Technical strings that are legitimately identical in both languages.
  const SAME_OK = new Set<string>();
  it("es is actually translated (no long message identical to en)", () => {
    const same = Object.keys(flat.en).filter((k) => typeof flat.en[k] === "string" && (flat.en[k] as string).length > 40 && !SAME_OK.has(k) && flat.en[k] === flat.es[k]);
    expect(same).toEqual([]);
  });
});

describe("i18n keys used in code", () => {
  const files = [...walk("components", [".vue", ".ts"]), ...walk("pages", [".vue"]), ...walk("layouts", [".vue"]), ...walk("utils", [".ts"]), ...walk("plugins", [".ts"])];
  const calls = /(?<![\w.])\$?(?:t|tm|rt|te)\(\s*(['"`])([^'"`]+)\1/g;
  const used = new Map<string, string>();
  for (const f of files) for (const m of read(f).matchAll(calls)) used.set(m[2], f);

  it("every static key exists in en and es", () => {
    const missing = [...used].filter(([k]) => !k.includes("${") && !(k in flat.en && k in flat.es)).map(([k, f]) => `${k} (${f})`);
    expect(missing).toEqual([]);
  });

  it("every dynamic key prefix matches at least one message", () => {
    const orphan = [...used].filter(([k]) => k.includes("${")).filter(([k]) => !Object.keys(flat.en).some((e) => e.startsWith(k.split("${")[0]))).map(([k, f]) => `${k} (${f})`);
    expect(orphan).toEqual([]);
  });
});

describe("i18n orphan keys", () => {
  const src = [...walk("components", [".vue", ".ts"]), ...walk("pages", [".vue"]), ...walk("layouts", [".vue"]), ...walk("utils", [".ts"]), ...walk("plugins", [".ts"]), "app.vue", "error.vue"].map((f) => read(f)).join("\n");
  // A key counts as used if it, or any parent path (t("a.b") for a.b.c, a dynamic `a.${x}`), appears in code.
  const used = (k: string) => {
    const parts = k.split(".");
    return parts.some((_, i) => i > 0 && src.includes(parts.slice(0, i + 1).join("."))) || src.includes(parts.slice(0, -1).join(".") + ".${") || (parts.length === 1 && src.includes(`"${k}"`));
  };
  it("every key is referenced from code", () => {
    const keys = Object.keys(flat.en).filter((k) => !k.includes("["));
    expect(keys.filter((k) => !used(k))).toEqual([]);
  });
});
