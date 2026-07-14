<script setup lang="ts">
definePageMeta({
  title: "Projects",
});
</script>

<template>
  <div>
    <section class="relative border-b-2 border-ink overflow-hidden">
      <div class="absolute inset-0 grid-overlay" />
      <div class="relative mx-auto max-w-[1180px] px-6 py-16 sm:px-10">
        <div class="font-mono text-xs text-cyan mb-3.5">{{ $t("projects.label") }}</div>
        <h1 class="m-0 font-display font-black uppercase text-slate-50 leading-[0.9] tracking-[-0.02em] text-[clamp(3rem,7vw,5rem)]">
          {{ $t("projects.title") }}
        </h1>
        <p class="mt-5 text-[17px] leading-relaxed text-slate-300 max-w-[56ch]">{{ $t("projects.subtitle") }}</p>
      </div>
    </section>

    <ProjectsGrid />

    <SharedCtaBand />
  </div>
</template>
