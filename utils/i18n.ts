// Resolves an embedded per-locale content field ({ en, es }) to the active
// locale. A plain string/array passes through untouched, so migrated and
// un-migrated content files can coexist.
export type Localized<T> = T | Partial<Record<string, T>>;

export function useLocalized() {
  const { locale, defaultLocale } = useI18n();

  function tr<T>(field: Localized<T> | null | undefined): T | undefined {
    if (field == null) return undefined;
    if (typeof field !== "object" || Array.isArray(field)) return field as T;
    const map = field as Record<string, T>;
    return map[locale.value] ?? map[defaultLocale ?? "en"] ?? Object.values(map)[0];
  }

  return { tr };
}
