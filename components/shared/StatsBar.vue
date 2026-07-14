<script setup lang="ts">
const stats = [
  { value: "9+", color: "text-yellow", label: "stats.experience" },
  { value: "10+", color: "text-cyan", label: "stats.clients" },
  { value: "20+", color: "text-indigo", label: "stats.projects" },
];
</script>

<template>
  <div class="mx-auto max-w-[1180px] flex flex-col sm:flex-row border-b-2 border-ink bg-surface">
    <div v-for="(stat, i) in stats" :key="stat.label" class="flex-1 px-6 py-7 sm:px-10" :class="i < stats.length - 1 ? 'border-b-2 sm:border-b-0 sm:border-r-2 border-ink' : ''">
      <span class="font-display font-black text-[40px]" :class="stat.color">{{ stat.value }}</span>
      <div class="font-mono text-xs text-muted uppercase tracking-[0.04em] mt-0.5">{{ $t(stat.label) }}</div>
    </div>
  </div>
</template>
