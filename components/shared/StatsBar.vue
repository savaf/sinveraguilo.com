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

// Count up from 0 once the bar scrolls into view (final values on SSR / reduced motion).
const root = ref<HTMLElement | null>(null);
const progress = ref(1);
onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !root.value) return;
  progress.value = 0;
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / 1200, 1);
        progress.value = 1 - Math.pow(1 - t, 3);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    { threshold: 0.4 },
  );
  io.observe(root.value);
  onBeforeUnmount(() => io.disconnect());
});
const shown = (v: string) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? v : `${Math.round(n * progress.value)}${v.replace(/^\d+/, "")}`;
};
</script>

<template>
  <div ref="root" class="mx-auto max-w-[1180px] flex flex-col sm:flex-row border-b-2 border-ink bg-surface">
    <div v-for="(stat, i) in stats" :key="stat.label" v-reveal="i * 90" class="flex-1 px-6 py-7 sm:px-10" :class="i < stats.length - 1 ? 'border-b-2 sm:border-b-0 sm:border-r-2 border-ink' : ''">
      <span class="font-display font-black text-[40px]" :class="stat.color">{{ shown(stat.value) }}</span>
      <div class="font-mono text-xs text-muted uppercase tracking-[0.04em] mt-0.5">{{ $t(stat.label) }}</div>
    </div>
  </div>
</template>
