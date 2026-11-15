<script setup lang="ts">
import type { Localized } from "~/utils/i18n";

type Exp = { company: string; position: Localized<string>; location: Localized<string>; startDate?: string; endDate?: string | null };

const { jobExperiences } = defineProps<{ jobExperiences: Exp[] }>();
const { tr } = useLocalized();
const { locale, t } = useI18n();

const idx = (v: string) => {
  const [y, m] = v.split("-").map(Number);
  return y * 12 + (m - 1);
};
const now = new Date();
const nowIdx = now.getFullYear() * 12 + now.getMonth() + 1;

const dated = computed(() => jobExperiences.map((exp, i) => ({ exp, i })).filter((r) => r.exp.startDate));
const first = computed(() => Math.floor(Math.min(...dated.value.map((r) => idx(r.exp.startDate!))) / 12) * 12);
const span = computed(() => nowIdx - first.value);
const years = computed(() => {
  const out: number[] = [];
  for (let y = first.value / 12; y * 12 <= nowIdx; y++) out.push(y);
  return out;
});

// Greedy lane packing so parallel roles stack instead of overlapping.
const bars = computed(() => {
  const lanes: number[] = [];
  return [...dated.value]
    .sort((a, b) => idx(a.exp.startDate!) - idx(b.exp.startDate!))
    .map(({ exp, i }) => {
      const s = idx(exp.startDate!);
      const e = exp.endDate ? idx(exp.endDate) + 1 : nowIdx;
      let lane = lanes.findIndex((end) => end <= s);
      if (lane < 0) lane = lanes.length;
      lanes[lane] = e;
      return { exp, i, lane, left: ((s - first.value) / span.value) * 100, width: Math.max(((e - s) / span.value) * 100, 0.8), current: !exp.endDate };
    });
});
const laneCount = computed(() => Math.max(1, ...bars.value.map((b) => b.lane + 1)));

const selected = ref<number | null>(null);
const active = computed(() => bars.value.find((b) => b.i === selected.value) || bars.value.find((b) => b.current) || null);
const label = (exp: Exp) => `${formatMonth(exp.startDate!, locale.value)} - ${exp.endDate ? formatMonth(exp.endDate, locale.value) : t("experience.present")}`;
</script>

<template>
  <section class="mx-auto max-w-[1180px] px-6 pt-16 sm:px-10 sm:pt-[72px]">
    <p v-reveal class="m-0 font-mono text-xs font-bold uppercase tracking-[0.06em] text-cyan">{{ $t("timeline.kicker") }}</p>
    <div v-reveal class="flex items-center gap-4 mt-2 mb-3">
      <h2 class="m-0 font-display font-black text-[clamp(2rem,5vw,2.75rem)] uppercase text-slate-50 tracking-[-0.01em]">{{ $t("timeline.title") }}</h2>
      <div class="flex-1 h-0.5 bg-ink" />
    </div>
    <p class="m-0 mb-8 font-mono text-[13px] text-dim max-w-[70ch]">{{ $t("timeline.hint") }} {{ $t("timeline.overlap") }}</p>

    <div class="border-2 border-ink bg-surface">
      <div class="overflow-x-auto">
        <div class="relative min-w-[720px] px-6 pt-4 pb-8 sm:px-8">
          <div class="relative" :style="{ height: `${laneCount * 40 + 28}px` }">
            <div v-for="y in years" :key="y" class="absolute top-0 bottom-0 border-l border-ink" :style="{ left: `${((y * 12 - first) / span) * 100}%` }">
              <span class="absolute bottom-0 left-1 font-mono text-[11px] text-dim">{{ y }}</span>
            </div>
            <button v-for="b in bars" :key="b.i" type="button" :aria-pressed="active?.i === b.i" :aria-label="`${tr(b.exp.position)} @ ${b.exp.company}, ${label(b.exp)}`" class="absolute h-8 overflow-hidden whitespace-nowrap border-2 px-2 text-left font-display text-xs font-extrabold uppercase transition-transform hover:-translate-y-0.5" :class="active?.i === b.i ? 'bg-yellow text-ink-text border-yellow shadow-[3px_3px_0_var(--accent)]' : b.current ? 'bg-primary-dark text-primary-light border-cyan' : 'bg-primary-dark text-slate-100 border-ink hover:border-yellow'" :style="{ left: `${b.left}%`, width: `${b.width}%`, top: `${b.lane * 40}px` }" @click="selected = b.i" @mouseenter="selected = b.i" @focus="selected = b.i">
              {{ b.exp.company }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="active" class="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t-2 border-ink px-6 py-5 sm:px-8 min-h-[72px]" aria-live="polite">
        <span class="font-mono text-xs text-yellow">{{ label(active.exp) }}</span>
        <span class="font-display font-black uppercase text-lg text-slate-50 flex-1 min-w-[12ch]">{{ active.exp.company }}</span>
        <span class="font-mono text-xs text-dim">{{ tr(active.exp.position) }} · {{ tr(active.exp.location) }}</span>
        <a :href="`#role-${active.i}`" class="font-mono text-xs font-bold uppercase text-cyan hover:underline">{{ $t("timeline.jump") }} ↓</a>
      </div>
    </div>
  </section>
</template>
