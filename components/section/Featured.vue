<script setup lang="ts">
const localePath = useLocalePath();
const { data: projects } = await useAsyncData("featured_projects", () => {
  return queryContent("projects").find();
});

// Hover index drives the cursor-following screenshot preview (desktop, fine pointers only).
const active = ref<number | null>(null);
const x = ref(0);
const y = ref(0);
function track(e: PointerEvent, i: number) {
  if (e.pointerType !== "mouse") return;
  const r = (e.currentTarget as HTMLElement).closest("[data-index]")!.getBoundingClientRect();
  x.value = e.clientX - r.left;
  y.value = e.clientY - r.top;
  active.value = i;
}
const pad = (n: number) => String(n + 1).padStart(2, "0");
const preview = (p: any) => p.image ?? "/images/projects/placeholder.svg";
</script>

<template>
  <section id="work" class="mx-auto max-w-[1180px] px-6 py-16 sm:px-10 sm:py-[72px]">
    <div v-reveal class="flex items-baseline justify-between flex-wrap gap-4 mb-8">
      <h2 class="m-0 font-display font-black text-[clamp(2rem,6vw,2.75rem)] uppercase text-slate-50 tracking-[-0.01em]">{{ $t("featured.title") }}</h2>
      <NuxtLink :to="localePath('/projects')" class="font-display font-extrabold uppercase text-sm text-ink-text bg-yellow border-2 border-ink px-5 py-3 shadow-[4px_4px_0_#22d3ee] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#22d3ee] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_#22d3ee]"> {{ $t("featured.more") }} → </NuxtLink>
    </div>

    <ol class="m-0 p-0 list-none border-t-2 border-ink" @pointerleave="active = null">
      <li v-for="(project, i) in projects" :key="project._path" v-reveal="i * 80" :data-index="i" class="work-row relative border-b-2 border-ink" :style="{ '--accent': projectAccent(i) }">
        <NuxtLink :to="localePath(`/projects/${project.slug}`)" class="group flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-8" :aria-label="project.title" @pointermove="track($event, i)" @focus="active = null">
          <span class="font-mono text-sm text-dim sm:w-10">{{ pad(i) }}</span>
          <NuxtImg :src="preview(project)" alt="" width="380" height="190" loading="lazy" :format="preview(project).endsWith('.svg') ? undefined : 'webp'" class="sm:hidden w-full h-[160px] object-cover border-2 border-ink" />
          <span class="flex-1 min-w-0">
            <span class="block font-display font-black uppercase leading-[0.95] tracking-[-0.01em] text-slate-50 text-[clamp(1.5rem,4vw,2.5rem)] transition-all duration-200 group-hover:translate-x-3 group-hover:text-[var(--accent)] group-focus-visible:text-[var(--accent)]">{{ project.title.split(" (")[0] }}</span>
            <span class="block mt-2 font-mono text-xs text-yellow">{{ projectCategory(project).toLowerCase() }}/ · {{ projectStack(project) }}</span>
          </span>
          <span class="hidden sm:block font-display font-extrabold text-2xl text-slate-50 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true">↗</span>
        </NuxtLink>

        <!-- Cursor-following screenshot -->
        <div class="preview pointer-events-none absolute z-10 hidden md:block w-[300px] border-2 border-ink bg-surface" :class="{ 'is-on': active === i }" :style="{ transform: `translate(${x + 24}px, ${y - 90}px) rotate(-2deg)`, boxShadow: '6px 6px 0 var(--accent)' }" aria-hidden="true">
          <NuxtImg :src="preview(project)" alt="" width="300" height="170" loading="lazy" :format="preview(project).endsWith('.svg') ? undefined : 'webp'" class="block w-full h-[170px] object-cover" />
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.preview {
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.15s ease;
  will-change: transform;
}
.preview.is-on {
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .preview {
    transition: none;
  }
}
</style>
