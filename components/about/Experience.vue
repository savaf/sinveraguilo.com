<script setup lang="ts">
import type { Localized } from "~/utils/i18n";

const { jobExperiences } = defineProps<{
  jobExperiences: {
    _path?: string;
    company: string;
    description: Localized<string[]>;
    position: Localized<string>;
    location: Localized<string>;
    date?: string;
    startDate?: string;
    endDate?: string | null;
  }[];
}>();

const { tr } = useLocalized();
const { locale, t } = useI18n();

const roleCount = computed(() => String(jobExperiences?.length || 0).padStart(2, "0"));

function dateLabel(exp: (typeof jobExperiences)[number]) {
  if (!exp.startDate) return exp.date ?? "";
  const start = formatMonth(exp.startDate, locale.value);
  const end = exp.endDate ? formatMonth(exp.endDate, locale.value) : t("experience.present");
  const months = monthsBetween(exp.startDate, exp.endDate);
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const parts: string[] = [];
  if (years) parts.push(t("experience.years", { n: years }, years));
  if (remMonths || !years) parts.push(t("experience.months", { n: remMonths || months }, remMonths || months));
  return `${start} - ${end} · ${parts.join(" ")}`;
}
</script>

<template>
  <section class="mx-auto max-w-[1180px] px-6 pt-16 pb-10 sm:px-10 sm:pt-[72px]">
    <div class="flex items-center gap-4 mb-10">
      <h2 class="m-0 font-display font-black text-[clamp(2rem,5vw,2.75rem)] uppercase text-slate-50 tracking-[-0.01em]">{{ $t("about.experienceTitle") }}</h2>
      <div class="flex-1 h-0.5 bg-ink" />
      <span class="font-mono text-[13px] text-dim whitespace-nowrap">{{ roleCount }} {{ $t("about.roles") }}</span>
    </div>

    <div class="flex flex-col gap-5">
      <article v-for="(exp, i) in jobExperiences" :key="exp._path" v-reveal="Math.min(i, 6) * 70" class="exp-card border-2 border-ink bg-surface px-7 py-6">
        <div class="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
          <h3 class="m-0 font-grotesk font-semibold text-xl text-primary-light">
            {{ tr(exp.position) }} <span class="text-cyan">@ {{ exp.company }}</span>
          </h3>
          <span class="font-mono text-xs text-yellow whitespace-nowrap">{{ dateLabel(exp) }}</span>
        </div>
        <div class="font-mono text-xs text-dim mb-3">{{ tr(exp.location) }}</div>
        <p v-for="line in tr(exp.description)" :key="line" class="m-0 mb-2 text-[15px] leading-relaxed text-slate-300">{{ line }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.exp-card {
  box-shadow: 6px 6px 0 #123049;
  transition:
    transform 0.15s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.exp-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0 #22d3ee;
}
.exp-card:active {
  transform: translate(0, 0);
  box-shadow: 5px 5px 0 #22d3ee;
}
</style>
