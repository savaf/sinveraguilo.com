<script setup lang="ts">
const { data: projects } = await useAsyncData("all_projects", () => {
  return queryContent("projects").find();
});

const activeFilter = ref("All");
const query = ref("");
const view = ref<"cards" | "index">("cards");
const localePath = useLocalePath();
const route = useRoute();
const router = useRouter();

// Technologies are multi-select (AND) and mirrored in ?tech= so a filtered view can be shared
const activeTech = ref<string[]>(
  String(route.query.tech || "")
    .split(",")
    .filter(Boolean),
);
const techCounts = computed(() => {
  const counts = new Map<string, number>();
  (projects.value || []).forEach((p) => {
    new Set((p as unknown as ProjectLike).technologies || []).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1));
  });
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
});
function toggleTech(t: string) {
  activeTech.value = activeTech.value.includes(t) ? activeTech.value.filter((x) => x !== t) : [...activeTech.value, t];
  const { tech: _omit, ...rest } = route.query;
  router.replace({ query: activeTech.value.length ? { ...rest, tech: activeTech.value.join(",") } : rest });
}

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
    const matchesTech = activeTech.value.every((t) => (project.technologies || []).includes(t));
    return matchesFilter && matchesQuery && matchesTech;
  });
});

// Compare up to 3 projects side by side (index view)
const MAX_COMPARE = 3;
const picked = ref<string[]>([]);
function togglePick(slug: string) {
  picked.value = picked.value.includes(slug) ? picked.value.filter((x) => x !== slug) : picked.value.length < MAX_COMPARE ? [...picked.value, slug] : picked.value;
}
const comparing = computed(() => picked.value.map((s) => (projects.value || []).find((p) => (p as unknown as ProjectLike).slug === s)).filter(Boolean) as unknown as ProjectLike[]);
const sharedTech = computed(() => {
  const lists = comparing.value.map((p) => p.technologies || []);
  return lists.length < 2 ? [] : lists[0].filter((t) => lists.every((l) => l.includes(t)));
});

// Surprise me: open a random project from whatever is currently filtered
function surprise() {
  const list = filtered.value as unknown as ProjectLike[];
  if (!list.length) return;
  const pick = list[Math.floor(Math.random() * list.length)];
  navigateTo(localePath(`/projects/${pick.slug}`));
}

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

        <div class="flex gap-2 font-display font-extrabold uppercase text-[13px]" role="group" :aria-label="$t('projects.view')">
          <button type="button" class="border-2 border-ink px-4 py-2.5 cursor-pointer transition-colors" :class="chipClass(view === 'cards')" :aria-pressed="view === 'cards'" @click="view = 'cards'">{{ $t("projects.viewCards") }}</button>
          <button type="button" class="border-2 border-ink px-4 py-2.5 cursor-pointer transition-colors" :class="chipClass(view === 'index')" :aria-pressed="view === 'index'" @click="view = 'index'">{{ $t("projects.viewIndex") }}</button>
        </div>

        <button type="button" class="border-2 border-ink bg-cyan text-ink-text px-4 py-2.5 font-display font-extrabold uppercase text-[13px] cursor-pointer transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed" :disabled="!filtered.length" @click="surprise">
          🎲 {{ $t("projects.surprise") }}
        </button>

        <div class="flex items-center border-2 border-ink bg-primary-dark">
          <span class="flex px-3 py-2.5 border-r-2 border-ink">
            <Icon name="i-heroicons-magnifying-glass" class="w-[18px] h-[18px] text-dim" aria-hidden="true" />
          </span>
          <input v-model="query" type="search" :placeholder="$t('projects.search')" class="border-none bg-transparent text-primary-light font-mono text-[13px] px-3.5 py-2.5 outline-hidden w-[200px]" aria-label="Search projects" />
        </div>
      </div>
    </div>

    <!-- Technology filter -->
    <div v-if="techCounts.length" class="border-b-2 border-ink bg-primary-dark">
      <div class="mx-auto max-w-[1180px] px-6 py-4 sm:px-10 flex flex-wrap items-center gap-2">
        <span class="font-mono text-[11px] uppercase text-dim mr-2">{{ $t("projects.tech") }}</span>
        <button v-for="[t, n] in techCounts" :key="t" type="button" :aria-pressed="activeTech.includes(t)" class="border-2 border-ink px-3 py-1.5 font-mono text-xs cursor-pointer transition-colors" :class="chipClass(activeTech.includes(t))" @click="toggleTech(t)">
          {{ t }} <span class="opacity-60">{{ n }}</span>
        </button>
        <button v-if="activeTech.length" type="button" class="font-mono text-xs text-dim underline cursor-pointer ml-2" @click="activeTech.slice().forEach(toggleTech)">{{ $t("projects.techClear") }}</button>
        <span class="ml-auto font-mono text-xs text-muted" aria-live="polite">{{ $t("projects.showing", { n: filtered.length, total: projects?.length || 0 }) }}</span>
      </div>
    </div>

    <ProjectsConstellation :projects="(projects || []) as unknown as ProjectLike[]" :active="activeTech" @toggle="toggleTech" />

    <!-- Grid -->
    <section class="mx-auto max-w-[1180px] px-6 py-12 sm:px-10">
      <ol v-if="filtered.length && view === 'index'" class="m-0 p-0 list-none border-2 border-ink bg-surface">
        <li v-for="(project, i) in filtered" :key="project._path" class="flex border-b-2 border-ink last:border-b-0">
          <button type="button" class="shrink-0 border-r-2 border-ink px-4 font-mono text-xs cursor-pointer transition-colors" :class="chipClass(picked.includes(project.slug))" :aria-pressed="picked.includes(project.slug)" :aria-label="`${$t('projects.compare')}: ${project.title}`" :disabled="!picked.includes(project.slug) && picked.length >= MAX_COMPARE" @click="togglePick(project.slug)">
            {{ picked.includes(project.slug) ? "✓" : "+" }}
          </button>
          <NuxtLink :to="localePath(`/projects/${project.slug}`)" class="row group flex-1 grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[3rem_1fr_9rem_1fr_auto] items-center gap-x-4 px-4 py-5 sm:px-6" :style="{ '--accent': projectAccent(i) }">
            <span class="font-mono text-xs text-dim">{{ String(i + 1).padStart(2, "0") }}</span>
            <span class="font-display font-black uppercase text-primary-light text-[clamp(1.1rem,2.5vw,1.75rem)] leading-tight">{{ project.title }}</span>
            <span class="hidden sm:block font-mono text-[11px] text-ink-text bg-yellow px-2 py-[3px] justify-self-start">{{ projectCategory(project as unknown as ProjectLike) }}</span>
            <span class="hidden sm:block font-mono text-xs text-muted">{{ projectStack(project as unknown as ProjectLike) }}</span>
            <span class="font-display font-black text-xl arrow" aria-hidden="true">→</span>
          </NuxtLink>
        </li>
      </ol>
      <div v-else-if="filtered.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectsCard v-for="(project, i) in filtered" :key="project._path" :project="project" :accent="projectAccent(i)" :category-chip="projectCategory(project)" :subtitle="projectStack(project)" img-class="h-[190px]" />
      </div>
      <div v-else class="text-center py-16 font-mono text-dim">{{ $t("projects.noResults") }}</div>

      <p v-if="filtered.length && view === 'index' && !picked.length" class="m-0 mt-3 font-mono text-xs text-dim">{{ $t("projects.compareHint", { n: MAX_COMPARE }) }}</p>

      <!-- Compare panel -->
      <div v-if="comparing.length" class="mt-8 border-2 border-ink bg-surface" role="region" :aria-label="$t('projects.compare')">
        <div class="flex items-center justify-between gap-4 border-b-2 border-ink px-4 py-3">
          <h2 class="m-0 font-display font-black uppercase text-primary-light text-lg">{{ $t("projects.compare") }}</h2>
          <button type="button" class="font-mono text-xs text-dim underline cursor-pointer" @click="picked = []">{{ $t("projects.compareClear") }}</button>
        </div>
        <p v-if="comparing.length < 2" class="m-0 px-4 py-4 font-mono text-xs text-muted">{{ $t("projects.comparePickMore") }}</p>
        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr>
                <th scope="col" class="w-28 p-3" />
                <th v-for="p in comparing" :key="p.slug" scope="col" class="p-3 text-left align-top font-display font-black uppercase text-primary-light">
                  <NuxtLink :to="localePath(`/projects/${p.slug}`)" class="hover:text-yellow">{{ p.title }}</NuxtLink>
                </th>
              </tr>
            </thead>
            <tbody class="font-mono text-xs">
              <tr class="border-t-2 border-ink">
                <th scope="row" class="p-3 text-left text-dim font-normal uppercase">{{ $t("projects.compareCategory") }}</th>
                <td v-for="p in comparing" :key="p.slug" class="p-3 text-muted">{{ projectCategory(p) }}</td>
              </tr>
              <tr class="border-t-2 border-ink">
                <th scope="row" class="p-3 text-left text-dim font-normal uppercase">{{ $t("projects.compareDate") }}</th>
                <td v-for="p in comparing" :key="p.slug" class="p-3 text-muted">{{ (p as any).publishDate || "—" }}</td>
              </tr>
              <tr class="border-t-2 border-ink">
                <th scope="row" class="p-3 text-left text-dim font-normal uppercase align-top">{{ $t("projects.tech") }}</th>
                <td v-for="p in comparing" :key="p.slug" class="p-3 align-top">
                  <span v-for="t in p.technologies || []" :key="t" class="mr-1.5 mb-1.5 inline-block border-2 border-ink px-2 py-0.5" :class="sharedTech.includes(t) ? 'bg-yellow text-ink-text' : 'text-muted'">{{ t }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="m-0 border-t-2 border-ink px-4 py-3 font-mono text-xs text-muted">
            {{ sharedTech.length ? $t("projects.compareShared", { list: sharedTech.join(", ") }) : $t("projects.compareNone") }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.row {
  transition:
    background-color 0.15s,
    padding-left 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.row:hover,
.row:focus-visible {
  background: var(--accent);
  padding-left: 2rem;
}
.row:hover *,
.row:focus-visible * {
  color: #0b0b0f;
}
.arrow {
  transition: transform 0.15s;
}
.row:hover .arrow {
  transform: translateX(6px);
}
</style>
