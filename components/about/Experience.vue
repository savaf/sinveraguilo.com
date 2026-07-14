<script setup lang="ts">
const { jobExperiences } = defineProps<{
  jobExperiences: {
    date: string;
    company: string;
    description: string[];
    position: string;
    location: string;
  }[];
}>();

const roleCount = computed(() => String(jobExperiences?.length || 0).padStart(2, "0"));
</script>

<template>
  <section class="mx-auto max-w-[1180px] px-6 pt-16 pb-10 sm:px-10 sm:pt-[72px]">
    <div class="flex items-center gap-4 mb-10">
      <h2 class="m-0 font-display font-black text-[clamp(2rem,5vw,2.75rem)] uppercase text-slate-50 tracking-[-0.01em]">{{ $t("about.experienceTitle") }}</h2>
      <div class="flex-1 h-0.5 bg-ink" />
      <span class="font-mono text-[13px] text-dim whitespace-nowrap">{{ roleCount }} {{ $t("about.roles") }}</span>
    </div>

    <div class="flex flex-col gap-5">
      <article v-for="exp in jobExperiences" :key="exp.position + exp.company" class="exp-card border-2 border-ink bg-surface px-7 py-6">
        <div class="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
          <h3 class="m-0 font-grotesk font-semibold text-xl text-primary-light">
            {{ exp.position }} <span class="text-cyan">@ {{ exp.company }}</span>
          </h3>
          <span class="font-mono text-xs text-yellow whitespace-nowrap">{{ exp.date }}</span>
        </div>
        <div class="font-mono text-xs text-dim mb-3">{{ exp.location }}</div>
        <p v-for="line in exp.description" :key="line" class="m-0 mb-2 text-[15px] leading-relaxed text-slate-300">{{ line }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.exp-card {
  box-shadow: 6px 6px 0 #123049;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}
.exp-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0 #22d3ee;
}
</style>
