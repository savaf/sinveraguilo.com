import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Regresión: con worktrees en .claude/ dentro del repo, `nuxt dev` recorría todos
// (watcher de Nuxt y de Nitro) y se quedaba sin memoria. Seam superficial a propósito:
// el síntoma real (RAM/tiempo de Nitro) solo se ve arrancando el dev server.
const config = readFileSync("nuxt.config.ts", "utf8");

describe("nuxt dev no recorre worktrees de agentes", () => {
  it("Nuxt ignora .claude", () => {
    expect(config).toMatch(/ignore:\s*\[[^\]]*"\.claude\/\*\*"/);
  });
  it("Nitro no vigila .claude", () => {
    expect(config).toMatch(/watchOptions:\s*\{\s*ignored:\s*\[[^\]]*\.claude/);
  });
});
