<script setup lang="ts">
type Exp = { startDate?: string; endDate?: string | null; skills?: string[] };

const { t } = useI18n();
const localePath = useLocalePath();
const { data } = await useAsyncData("fit_check_experiences", () => queryContent("experiences").find());

// Real skills with months of use, summed from role date ranges.
const known = computed(() => {
  const map = new Map<string, { name: string; months: number }>();
  for (const exp of (data.value || []) as Exp[]) {
    if (!exp.startDate) continue;
    const months = monthsBetween(exp.startDate, exp.endDate);
    for (const name of exp.skills || []) {
      const e = map.get(name.toLowerCase()) || { name, months: 0 };
      e.months += months;
      map.set(name.toLowerCase(), e);
    }
  }
  return map;
});

const input = ref("");
const wanted = computed(() =>
  [
    ...new Set(
      input.value
        .split(/[,\n;]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ].slice(0, 12),
);
const rows = computed(() =>
  wanted.value.map((w) => {
    const hit = known.value.get(w.toLowerCase());
    return { label: w, name: hit?.name, months: hit?.months || 0 };
  }),
);
const matched = computed(() => rows.value.filter((r) => r.name));
const missing = computed(() => rows.value.filter((r) => !r.name));
const pct = computed(() => (rows.value.length ? Math.round((matched.value.length / rows.value.length) * 100) : 0));
const fmt = (m: number) => (m >= 12 ? `${(m / 12).toFixed(1).replace(/\.0$/, "")} ${t("stack.years")}` : `${m} ${t("stack.months")}`);
const suggestions = computed(() =>
  [...known.value.values()]
    .sort((a, b) => b.months - a.months)
    .slice(0, 5)
    .map((s) => s.name),
);
const add = (n: string) => {
  if (!wanted.value.some((w) => w.toLowerCase() === n.toLowerCase())) input.value = input.value.trim() ? `${input.value.trim().replace(/[,;]$/, "")}, ${n}` : n;
};
const query = computed(() => ({
  subject: t("fit.subj"),
  message: t("fit.msg", { stack: wanted.value.join(", "), have: matched.value.map((r) => r.name).join(", ") || "-", pct: pct.value }),
}));
</script>

<template>
  <section id="fit" class="mx-auto max-w-[1180px] px-6 pt-16 sm:px-10 sm:pt-[72px]">
    <div v-reveal class="flex items-center gap-4 mb-3">
      <h2 class="m-0 font-display font-black text-[clamp(2rem,6vw,2.75rem)] uppercase text-slate-50 tracking-[-0.01em]">{{ $t("fit.title") }}</h2>
      <div class="flex-1 h-0.5 bg-ink" />
    </div>
    <p v-reveal class="m-0 mb-8 font-mono text-[13px] text-dim max-w-[70ch]">{{ $t("fit.subtitle") }}</p>

    <div class="grid border-2 border-ink bg-surface lg:grid-cols-[1fr_1.1fr]">
      <div class="p-6 sm:p-8">
        <label for="fit-input" class="font-mono text-xs font-bold uppercase text-cyan">{{ $t("fit.label") }}</label>
        <textarea id="fit-input" v-model="input" rows="4" :placeholder="$t('fit.placeholder')" class="mt-3 w-full resize-none border-2 border-ink bg-primary-dark p-3 font-mono text-sm text-slate-50 focus:border-yellow focus:outline-none" />
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <span class="font-mono text-xs text-dim">{{ $t("fit.try") }}</span>
          <button v-for="s in suggestions" :key="s" type="button" class="border-2 border-ink px-2 py-1 font-mono text-xs text-slate-100 hover:border-yellow" @click="add(s)">+ {{ s }}</button>
        </div>
      </div>

      <div class="border-t-2 border-ink p-6 sm:p-8 lg:border-l-2 lg:border-t-0" aria-live="polite">
        <p v-if="!rows.length" class="m-0 font-mono text-xs text-dim">{{ $t("fit.empty") }}</p>
        <template v-else>
          <p class="m-0 font-display text-5xl font-black text-yellow">{{ pct }}%</p>
          <p class="m-0 mt-1 font-mono text-xs text-dim">{{ $t("fit.summary", { m: matched.length, n: rows.length }) }}</p>
          <div class="mt-3 h-3 border-2 border-ink"><div class="h-full bg-cyan transition-all duration-500" :style="{ width: `${pct}%` }" /></div>
          <ul class="m-0 mt-4 flex list-none flex-col gap-1 p-0">
            <li v-for="r in matched" :key="r.label" class="flex justify-between font-mono text-sm text-slate-50">
              <span><span class="text-cyan">✓</span> {{ r.name }}</span
              ><span class="text-dim">{{ fmt(r.months) }}</span>
            </li>
            <li v-for="r in missing" :key="r.label" class="flex justify-between font-mono text-sm text-slate-300">
              <span><span class="text-yellow">?</span> {{ r.label }}</span
              ><span class="text-dim">{{ $t("fit.ask") }}</span>
            </li>
          </ul>
          <NuxtLink :to="{ path: localePath('/contact'), query }" class="mt-5 inline-block border-2 border-ink bg-cyan px-5 py-3 font-display text-sm font-extrabold uppercase text-ink-text shadow-[4px_4px_0_#6366f1] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5">{{ $t("fit.cta") }} →</NuxtLink>
        </template>
      </div>
    </div>
  </section>
</template>
