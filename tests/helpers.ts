import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export const ROOT = join(__dirname, "..");
export const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

export function walk(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  for (const name of readdirSync(join(ROOT, dir))) {
    const rel = join(dir, name);
    if (statSync(join(ROOT, rel)).isDirectory()) out.push(...walk(rel, exts));
    else if (exts.some((e) => name.endsWith(e))) out.push(rel);
  }
  return out;
}

export function flatten(value: unknown, prefix = ""): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (Array.isArray(value)) {
    out[prefix] = value;
    value.forEach((v, i) => Object.assign(out, flatten(v, `${prefix}[${i}]`)));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) Object.assign(out, flatten(v, prefix ? `${prefix}.${k}` : k));
  } else out[prefix] = value;
  return out;
}

// JSON.parse silently keeps the LAST duplicate key; this reports them.
export function duplicateKeys(json: string): string[] {
  const dups: string[] = [];
  JSON.parse(json, function (this: unknown, key: string, v: unknown) {
    return v;
  });
  const stack: Set<string>[] = [];
  const re = /"((?:[^"\\]|\\.)*)"\s*:|[{}\[\]]|"(?:[^"\\]|\\.)*"/g;
  const kinds: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(json))) {
    const t = m[0];
    if (t === "{") { stack.push(new Set()); kinds.push("o"); }
    else if (t === "[") { kinds.push("a"); stack.push(new Set()); }
    else if (t === "}" || t === "]") { stack.pop(); kinds.pop(); }
    else if (m[1] !== undefined && kinds[kinds.length - 1] === "o") {
      const set = stack[stack.length - 1];
      if (set.has(m[1])) dups.push(m[1]);
      set.add(m[1]);
    }
  }
  return dups;
}
