import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatMonth, monthsBetween } from "../utils/duration";
import { PROJECT_ACCENTS, projectAccent, projectCategory, projectStack } from "../utils/projects";

describe("monthsBetween", () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date(2026, 10, 15)); });
  afterEach(() => vi.useRealTimers());
  it("counts both endpoint months", () => expect(monthsBetween("2025-11", "2025-11")).toBe(1));
  it("spans years", () => expect(monthsBetween("2024-01", "2025-12")).toBe(24));
  it("open-ended range runs to the current month", () => expect(monthsBetween("2026-09")).toBe(3));
  it("null end means ongoing", () => expect(monthsBetween("2026-10", null)).toBe(2));
  it("never returns less than 1 (reversed dates)", () => expect(monthsBetween("2026-05", "2025-01")).toBe(1));
});

describe("formatMonth", () => {
  it("localizes in English", () => expect(formatMonth("2025-11", "en")).toMatch(/Nov(\.|ember)? 2025/));
  it("localizes in Spanish", () => expect(formatMonth("2025-11", "es").toLowerCase()).toMatch(/nov/));
});

describe("projects helpers", () => {
  const p = (tags?: string[], technologies?: string[]) => ({ title: "t", slug: "s", image: "i", tags, technologies });
  it("rotates accents and wraps around", () => {
    expect(projectAccent(0)).toBe(PROJECT_ACCENTS[0]);
    expect(projectAccent(PROJECT_ACCENTS.length)).toBe(PROJECT_ACCENTS[0]);
  });
  it("category prefers Landing, then Frontend, then first tag, then fallback", () => {
    expect(projectCategory(p(["Frontend", "Landing"]))).toBe("Landing");
    expect(projectCategory(p(["X", "Frontend"]))).toBe("Frontend");
    expect(projectCategory(p(["X"]))).toBe("X");
    expect(projectCategory(p())).toBe("Project");
  });
  it("stack line shows at most three technologies", () => {
    expect(projectStack(p(undefined, ["a", "b", "c", "d"]))).toBe("a · b · c");
    expect(projectStack(p())).toBe("");
  });
});

describe("useLocalized", () => {
  it("resolves per-locale fields, falls back to default then first value, passes plain values through", async () => {
    let current = "es";
    (globalThis as any).useI18n = () => ({ locale: { get value() { return current; } }, defaultLocale: "en" });
    const { useLocalized } = await import("../utils/i18n");
    const { tr } = useLocalized();
    expect(tr({ en: "a", es: "b" })).toBe("b");
    current = "fr";
    expect(tr({ en: "a", es: "b" })).toBe("a");
    expect(tr({ es: "b" })).toBe("b");
    expect(tr(["x", "y"])).toEqual(["x", "y"]);
    expect(tr("plain")).toBe("plain");
    expect(tr(null)).toBeUndefined();
  });
});
