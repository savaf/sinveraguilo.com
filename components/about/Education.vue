<script setup lang="ts">
const { educations } = defineProps<{
  educations: {
    title: string;
    date: string;
    company: string;
    description: string[];
  }[];
}>();
</script>

<template>
  <section class="mx-auto max-w-[1180px] px-6 pt-10 pb-20 sm:px-10">
    <div class="flex items-center gap-4 mb-10">
      <h2 class="m-0 font-display font-black text-[clamp(2rem,5vw,2.75rem)] uppercase text-slate-50 tracking-[-0.01em]">{{ $t("about.educationTitle") }}</h2>
      <div class="flex-1 h-0.5 bg-ink" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <article v-for="edu in educations" :key="edu.title" class="edu-card border-2 border-ink bg-surface px-7 py-6">
        <span class="inline-block font-mono text-[11px] text-ink-text bg-cyan px-2 py-[3px] mb-3">{{ edu.date }}</span>
        <h3 class="m-0 mb-1 font-grotesk font-semibold text-[19px] text-primary-light">{{ edu.title }}</h3>
        <div class="font-mono text-xs text-yellow mb-3">{{ edu.company }}</div>
        <p v-for="line in edu.description" :key="line" class="m-0 mb-1.5 text-[15px] leading-relaxed text-slate-300">{{ line }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.edu-card {
  box-shadow: 6px 6px 0 #6366f1;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}
.edu-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0 #6366f1;
}
</style>
