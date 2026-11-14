<script setup lang="ts">
import type { Localized } from "~/utils/i18n";

type Exp = { _path?: string; company: string; position: Localized<string>; startDate?: string; endDate?: string | null; skills?: string[] };

const { tr } = useLocalized();
const { data } = await useAsyncData("stack_explorer_experiences", () => queryContent("experiences").find());

// Months of use per skill, summed from real role date ranges.
const skills = computed(() => {
  const map = new Map<string, { name: string; months: number; roles: Exp[] }>();
  for (const exp of (data.value || []) as Exp[]) {
    if (!exp.startDate) continue;
    const months = monthsBetween(exp.startDate, exp.endDate);
    for (const name of exp.skills || []) {
      const entry = map.get(name) || { name, months: 0, roles: [] };
      entry.months += months;
      entry.roles.push(exp);
      map.set(name, entry);
    }
  }
  return [...map.values()].sort((a, b) => b.months - a.months).slice(0, 24);
});

const selected = ref<string | null>(null);
const active = computed(() => skills.value.find((s) => s.name === selected.value) || null);
const max = computed(() => skills.value[0]?.months || 1);
const toggle = (name: string) => (selected.value = selected.value === name ? null : name);
const size = (months: number) => (0.8 + (months / max.value) * 0.7).toFixed(2);
const yearsLabel = (months: number) => (months >= 12 ? `${(months / 12).toFixed(1).replace(/\.0$/, "")}` : `${months}`);
</script>

<template>
  <section id="stack" class="mx-auto max-w-[1180px] px-6 pt-16 sm:px-10 sm:pt-[72px]">
    <div v-reveal class="flex items-center gap-4 mb-3">
      <h2 class="m-0 font-display font-black text-[clamp(2rem,6vw,2.75rem)] uppercase text-slate-50 tracking-[-0.01em]">{{ $t("stack.title") }}</h2>
      <div class="flex-1 h-0.5 bg-ink" />
    </div>
    <p v-reveal class="m-0 mb-8 font-mono text-[13px] text-dim max-w-[70ch]">{{ $t("stack.subtitle") }}</p>

    <div class="border-2 border-ink bg-surface">
      <div class="flex flex-wrap gap-3 p-6 sm:p-8">
        <button v-for="s in skills" :key="s.name" type="button" :aria-pressed="selected === s.name" class="font-display font-extrabold uppercase border-2 border-ink px-3 py-1.5 transition-all hover:-translate-y-0.5" :class="selected === s.name ? 'bg-yellow text-ink-text shadow-[4px_4px_0_var(--accent)]' : 'text-slate-100 hover:border-yellow'" :style="{ fontSize: `${size(s.months)}rem` }" @click="toggle(s.name)">
          {{ s.name }}
        </button>
      </div>
      <div class="border-t-2 border-ink px-6 py-5 sm:px-8 min-h-[96px]" aria-live="polite">
        <p v-if="!active" class="m-0 font-mono text-xs text-dim">{{ $t("stack.hint") }}</p>
        <template v-else>
          <p class="m-0 font-mono text-xs text-yellow">{{ active.name }} · {{ yearsLabel(active.months) }} {{ active.months >= 12 ? $t("stack.years") : $t("stack.months") }}</p>
          <ul class="m-0 mt-3 p-0 list-none flex flex-col gap-1 text-[15px] text-slate-300">
            <li v-for="r in active.roles" :key="r._path || r.company + r.startDate">
              <span class="font-display font-black uppercase text-slate-50">{{ r.company }}</span>
              <span class="font-mono text-xs text-dim"> — {{ tr(r.position) }}</span>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </section>
</template>
