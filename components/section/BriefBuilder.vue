<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const needs = ["web", "migration", "role", "freelance"] as const;
const times = ["asap", "month", "explore"] as const;
const need = ref<(typeof needs)[number]>("web");
const time = ref<(typeof times)[number]>("month");

const target = computed(() => {
  const n = t(`brief.needs.${need.value}`);
  const w = t(`brief.times.${time.value}`);
  return {
    path: localePath("/contact"),
    query: { subject: t("brief.subj", { need: n }), message: t("brief.msg", { need: n, time: w }) },
  };
});

const chip = (active: boolean) => ["cursor-pointer font-display font-bold uppercase text-sm border-2 border-ink px-4 py-3 transition-all", active ? "bg-yellow text-ink-text shadow-[4px_4px_0_#22d3ee] -translate-x-0.5 -translate-y-0.5" : "bg-surface text-primary-light hover:border-cyan"];
</script>

<template>
  <section class="border-t-2 border-ink bg-primary-dark">
    <div v-reveal class="mx-auto max-w-[1180px] px-6 py-16 sm:px-10">
      <h2 class="m-0 font-display font-black uppercase text-primary-light tracking-[-0.01em] text-[clamp(2rem,4.5vw,3rem)]">{{ $t("brief.title") }}</h2>
      <p class="mt-3 mb-8 text-base text-muted max-w-[52ch]">{{ $t("brief.subtitle") }}</p>

      <div class="grid gap-8 md:grid-cols-2">
        <fieldset class="m-0 border-0 p-0">
          <legend class="font-mono text-xs uppercase tracking-[0.04em] text-muted mb-3">{{ $t("brief.needLabel") }}</legend>
          <div class="flex flex-wrap gap-3">
            <button v-for="n in needs" :key="n" type="button" :aria-pressed="need === n" :class="chip(need === n)" @click="need = n">{{ $t(`brief.needs.${n}`) }}</button>
          </div>
        </fieldset>
        <fieldset class="m-0 border-0 p-0">
          <legend class="font-mono text-xs uppercase tracking-[0.04em] text-muted mb-3">{{ $t("brief.timeLabel") }}</legend>
          <div class="flex flex-wrap gap-3">
            <button v-for="x in times" :key="x" type="button" :aria-pressed="time === x" :class="chip(time === x)" @click="time = x">{{ $t(`brief.times.${x}`) }}</button>
          </div>
        </fieldset>
      </div>

      <NuxtLink :to="target" class="mt-10 inline-block font-display font-extrabold uppercase text-base text-ink-text bg-yellow border-2 border-ink px-[30px] py-[18px] shadow-[6px_6px_0_#6366f1] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#6366f1]">{{ $t("brief.send") }} →</NuxtLink>
    </div>
  </section>
</template>
