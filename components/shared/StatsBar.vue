<script setup lang="ts">
const { data: jobExperiences } = await useAsyncData("stats_bar_experiences", () => queryContent("experiences").find());

const experiences = computed(() => jobExperiences.value || []);

const yearsExperience = computed(() => {
  const starts = experiences.value.map((exp: any) => exp.startDate).filter(Boolean);
  if (!starts.length) return "9+";
  const earliest = starts.sort()[0];
  const years = Math.floor(monthsBetween(earliest) / 12);
  return `${years}+`;
});

const migrationsLed = computed(() => {
  const count = experiences.value.filter((exp: any) => JSON.stringify(exp.description).toLowerCase().includes("migrat")).length;
  return `${count}+`;
});

const rolesCount = computed(() => `${experiences.value.length}+`);

const stats = computed(() => [
  { value: yearsExperience.value, color: "text-yellow", label: "stats.experience" },
  { value: migrationsLed.value, color: "text-cyan", label: "stats.migrations" },
  { value: rolesCount.value, color: "text-indigo", label: "stats.roles" },
]);
</script>

<template>
  <div class="mx-auto max-w-[1180px] flex flex-col sm:flex-row border-b-2 border-ink bg-surface">
    <div v-for="(stat, i) in stats" :key="stat.label" v-reveal="i * 90" class="flex-1 px-6 py-7 sm:px-10" :class="i < stats.length - 1 ? 'border-b-2 sm:border-b-0 sm:border-r-2 border-ink' : ''">
      <span class="font-display font-black text-[40px]" :class="stat.color">{{ stat.value }}</span>
      <div class="font-mono text-xs text-muted uppercase tracking-[0.04em] mt-0.5">{{ $t(stat.label) }}</div>
    </div>
  </div>
</template>
