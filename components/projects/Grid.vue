<script setup lang="ts">
const { data: projects } = await useAsyncData("all_projects", () => {
  return queryContent("projects").find();
});

const activeFilter = ref("All");
const query = ref("");

// Distinct categories present in the content, in a stable order
const categories = computed(() => {
  const set = new Set<string>();
  (projects.value || []).forEach((p) => set.add(projectCategory(p as ProjectLike)));
  return Array.from(set);
});

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return (projects.value || []).filter((p) => {
    const project = p as unknown as ProjectLike;
    const cat = projectCategory(project);
    const matchesFilter = activeFilter.value === "All" || cat === activeFilter.value;
    const haystack = [project.title, cat, projectStack(project), ...(project.technologies || [])].join(" ").toLowerCase();
    const matchesQuery = !q || haystack.includes(q);
    return matchesFilter && matchesQuery;
  });
});

function chipClass(active: boolean) {
  return active ? "bg-yellow text-ink-text" : "bg-primary-dark text-muted hover:text-white";
}
</script>

<template>
  <div>
    <!-- Filter + search bar -->
    <div class="border-b-2 border-ink bg-surface">
      <div class="mx-auto max-w-[1180px] px-6 py-5 sm:px-10 flex flex-wrap items-center justify-between gap-4">
        <div class="flex gap-2 font-display font-extrabold uppercase text-[13px]">
          <button type="button" class="border-2 border-ink px-4 py-2.5 cursor-pointer transition-colors" :class="chipClass(activeFilter === 'All')" @click="activeFilter = 'All'">
            {{ $t("projects.filterAll") }}
          </button>
          <button v-for="cat in categories" :key="cat" type="button" class="border-2 border-ink px-4 py-2.5 cursor-pointer transition-colors" :class="chipClass(activeFilter === cat)" @click="activeFilter = cat">
            {{ cat }}
          </button>
        </div>

        <div class="flex items-center border-2 border-ink bg-primary-dark">
          <span class="flex px-3 py-2.5 border-r-2 border-ink">
            <Icon name="i-heroicons-magnifying-glass" class="w-[18px] h-[18px] text-dim" aria-hidden="true" />
          </span>
          <input v-model="query" type="search" :placeholder="$t('projects.search')" class="border-none bg-transparent text-primary-light font-mono text-[13px] px-3.5 py-2.5 outline-hidden w-[200px]" aria-label="Search projects" />
        </div>
      </div>
    </div>

    <!-- Grid -->
    <section class="mx-auto max-w-[1180px] px-6 py-12 sm:px-10">
      <div v-if="filtered.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectsCard v-for="(project, i) in filtered" :key="project._path" :project="project" :accent="projectAccent(i)" :category-chip="projectCategory(project)" :subtitle="projectStack(project)" img-class="h-[190px]" />
      </div>
      <div v-else class="text-center py-16 font-mono text-dim">{{ $t("projects.noResults") }}</div>
    </section>
  </div>
</template>
