<script setup lang="ts">
type Exp = { company: string; startDate?: string; endDate?: string | null; skills?: string[] };

const props = defineProps<{ jobExperiences: Exp[] }>();

const now = new Date();
const roles = computed(() => props.jobExperiences.filter((e) => e.startDate));
const startYear = computed(() => Math.min(...roles.value.map((e) => Number(e.startDate!.slice(0, 4)))));
const years = computed(() => Array.from({ length: now.getFullYear() - startYear.value + 1 }, (_, i) => startYear.value + i));

// Months each skill was used per calendar year, from real role date ranges.
const rows = computed(() => {
  const map = new Map<string, { name: string; total: number; byYear: Record<number, number> }>();
  for (const e of roles.value) {
    const [sy, sm] = e.startDate!.split("-").map(Number);
    const [ey, em] = e.endDate ? e.endDate.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];
    for (const name of e.skills || []) {
      const row = map.get(name) || { name, total: 0, byYear: {} };
      for (let y = sy; y <= ey; y++) {
        const from = y === sy ? sm : 1;
        const to = y === ey ? em : 12;
        if (to < from) continue;
        row.byYear[y] = Math.min(12, (row.byYear[y] || 0) + to - from + 1);
        row.total += to - from + 1;
      }
      map.set(name, row);
    }
  }
  return [...map.values()].sort((a, b) => b.total - a.total).slice(0, 14);
});

const active = ref<string | null>(null);
const opacity = (m = 0) => (m ? 0.2 + (m / 12) * 0.8 : 0);
</script>

<template>
  <section class="mx-auto max-w-[1180px] px-6 pt-16 sm:px-10">
    <div v-reveal class="mb-3 flex items-center gap-4">
      <h2 class="m-0 font-display font-black text-[clamp(2rem,6vw,2.75rem)] uppercase text-slate-50 tracking-[-0.01em]">{{ $t("heatmap.title") }}</h2>
      <div class="h-0.5 flex-1 bg-ink" />
    </div>
    <p v-reveal class="m-0 mb-8 max-w-[70ch] font-mono text-[13px] text-dim">{{ $t("heatmap.subtitle") }}</p>

    <div class="overflow-x-auto border-2 border-ink bg-surface p-4 sm:p-6">
      <table class="w-full min-w-[560px] border-separate border-spacing-1 text-left">
        <caption class="sr-only">
          {{
            $t("heatmap.title")
          }}
        </caption>
        <thead>
          <tr>
            <th scope="col" class="w-40 font-mono text-xs font-normal text-dim">{{ $t("heatmap.skill") }}</th>
            <th v-for="y in years" :key="y" scope="col" class="text-center font-mono text-xs font-normal text-dim">{{ String(y).slice(2) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.name" :class="active === r.name ? 'outline outline-2 outline-yellow' : ''" @mouseenter="active = r.name" @mouseleave="active = null">
            <th scope="row" class="whitespace-nowrap pr-2 font-display text-sm font-extrabold uppercase text-slate-50">{{ r.name }}</th>
            <td v-for="y in years" :key="y" class="h-6 p-0" :title="r.byYear[y] ? `${r.name} · ${y} · ${r.byYear[y]} ${$t('stack.months')}` : undefined">
              <div class="h-full min-h-6 bg-yellow" :style="{ opacity: r.byYear[y] ? opacity(r.byYear[y]) : 0.06 }" :aria-label="r.byYear[y] ? `${r.byYear[y]} ${$t('stack.months')}` : undefined" />
            </td>
          </tr>
        </tbody>
      </table>
      <p class="m-0 mt-4 font-mono text-xs text-dim">{{ $t("heatmap.legend") }}</p>
    </div>
  </section>
</template>
