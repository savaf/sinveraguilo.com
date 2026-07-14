<script setup lang="ts">
const { data: projects } = await useAsyncData("featured_projects", () => {
  return queryContent("projects").limit(3).find();
});
</script>

<template>
  <section class="mx-auto max-w-[1180px] px-6 py-16 sm:px-10 sm:py-[72px]">
    <div class="flex items-baseline justify-between flex-wrap gap-4 mb-8">
      <div>
        <div class="font-mono text-xs text-cyan mb-2">{{ $t("featured.label") }}</div>
        <h2 class="m-0 font-display font-black text-[44px] uppercase text-slate-50 tracking-[-0.01em]">{{ $t("featured.title") }}</h2>
      </div>
      <NuxtLink to="/projects" class="font-display font-extrabold uppercase text-sm text-ink-text bg-yellow border-2 border-ink px-5 py-3 shadow-[4px_4px_0_#22d3ee] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#22d3ee]"> {{ $t("featured.more") }} → </NuxtLink>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectsCard v-for="(project, i) in projects" :key="project._path" :project="project" :accent="projectAccent(i)" :subtitle="`${projectCategory(project).toLowerCase()}/ · ${projectStack(project)}`" subtitle-class="text-yellow" />
    </div>
  </section>
</template>
