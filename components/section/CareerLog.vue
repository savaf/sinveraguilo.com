<script setup lang="ts">
import type { Localized } from "~/utils/i18n";

type Exp = {
  _path?: string;
  company: string;
  position: Localized<string>;
  description: Localized<string[]>;
  startDate?: string;
  endDate?: string | null;
  skills?: string[];
};

const localePath = useLocalePath();
const { tr } = useLocalized();
const { locale, t } = useI18n();

const { data } = await useAsyncData("career_log_experiences", () => queryContent("experiences").find());
const roles = computed(() => [...((data.value || []) as Exp[])].sort((a, b) => (b.startDate || "").localeCompare(a.startDate || "")).slice(0, 5));

function range(exp: Exp) {
  if (!exp.startDate) return "";
  const end = exp.endDate ? formatMonth(exp.endDate, locale.value) : t("experience.present");
  return `${formatMonth(exp.startDate, locale.value)} → ${end}`;
}
</script>

<template>
  <section id="career" class="mx-auto max-w-[1180px] px-6 pt-16 sm:px-10 sm:pt-[72px]">
    <div v-reveal class="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8">
      <h2 class="m-0 font-display font-black text-[clamp(2rem,6vw,2.75rem)] uppercase text-slate-50 tracking-[-0.01em]">{{ $t("careerLog.title") }}</h2>
      <div class="flex-1 h-0.5 bg-ink" />
      <NuxtLink :to="localePath('/about')" class="font-mono text-[13px] text-cyan whitespace-nowrap hover:underline">{{ $t("careerLog.all") }} →</NuxtLink>
    </div>

    <div class="border-2 border-ink bg-surface">
      <details v-for="(exp, i) in roles" :key="exp._path || exp.company" name="career-log" :open="i === 0" class="career-row group" :class="i > 0 ? 'border-t-2 border-ink' : ''">
        <summary class="flex flex-wrap items-baseline gap-x-6 gap-y-1 px-6 py-5 sm:px-8 cursor-pointer list-none hover:bg-ink/40">
          <span class="font-mono text-xs text-yellow w-[150px] shrink-0">{{ range(exp) }}</span>
          <span class="font-display font-black uppercase text-xl text-slate-50 flex-1 min-w-[10ch]">{{ exp.company }}</span>
          <span class="font-mono text-xs text-dim">{{ tr(exp.position) }}</span>
          <span class="font-mono text-cyan text-lg leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
        </summary>
        <div class="px-6 pb-6 sm:px-8 sm:pl-[calc(2rem+174px)]">
          <p class="m-0 text-[15px] leading-relaxed text-slate-300 max-w-[70ch]">{{ tr(exp.description)?.[0] }}</p>
          <div v-if="exp.skills?.length" class="flex flex-wrap gap-2 mt-4 font-mono text-xs">
            <span v-for="skill in exp.skills.slice(0, 6)" :key="skill" class="border-2 border-ink px-2.5 py-1 text-slate-200">{{ skill }}</span>
          </div>
        </div>
      </details>
    </div>
  </section>
</template>

<style scoped>
.career-row > summary::-webkit-details-marker {
  display: none;
}
</style>
