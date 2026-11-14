<script setup lang="ts">
// Only my own GitHub Pages demos are embedded; they are mine, so framing is safe.
const { data: all } = await useAsyncData("live_demos", () => queryContent("projects").find());
const demos = computed(() => (all.value || []).filter((p: any) => /\.github\.io\//.test(p.previewLink || "")));
const loaded = ref<Record<string, boolean>>({});
const localePath = useLocalePath();
</script>

<template>
  <section v-if="demos.length" class="border-t-2 border-ink bg-surface">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-10">
      <p class="m-0 font-mono text-xs font-bold uppercase tracking-[0.06em] text-cyan">{{ $t("demos.kicker") }}</p>
      <h2 class="m-0 mt-2 font-display font-black uppercase text-slate-50 tracking-[-0.01em] text-[clamp(2rem,4.5vw,3rem)] max-w-[22ch]">{{ $t("demos.title") }}</h2>
      <p class="m-0 mt-3 max-w-[60ch] text-slate-300">{{ $t("demos.lead") }}</p>
      <div class="mt-10 grid gap-8 md:grid-cols-2">
        <article v-for="p in demos" :key="p._path" v-reveal class="border-2 border-ink bg-primary-dark shadow-[6px_6px_0_var(--accent)]">
          <header class="flex items-center justify-between gap-3 border-b-2 border-ink px-4 py-3">
            <h3 class="m-0 font-display text-lg font-extrabold uppercase text-slate-50">{{ p.title }}</h3>
            <a :href="p.previewLink" target="_blank" rel="noopener noreferrer" class="font-mono text-xs font-bold uppercase text-yellow underline underline-offset-4 hover:text-cyan">{{ $t("demos.open") }} ↗</a>
          </header>
          <div class="relative h-[460px] bg-black">
            <iframe v-if="loaded[p._path]" :src="p.previewLink" :title="p.title" loading="lazy" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin" class="h-full w-full border-0 bg-white" />
            <button v-else type="button" class="group absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-3 text-slate-50" @click="loaded[p._path] = true">
              <NuxtImg :src="p.image" alt="" width="560" height="460" loading="lazy" format="webp" class="absolute inset-0 h-full w-full object-cover opacity-40 transition-opacity group-hover:opacity-60" />
              <span class="relative border-2 border-ink bg-yellow px-5 py-3 font-display text-sm font-extrabold uppercase text-ink-text shadow-[4px_4px_0_var(--accent)] transition-transform group-hover:-translate-y-0.5">▶ {{ $t("demos.run") }}</span>
              <span class="relative font-mono text-xs">{{ $t("demos.note") }}</span>
            </button>
          </div>
          <footer class="px-4 py-3 text-right">
            <NuxtLink :to="localePath(`/projects/${p.slug}`)" class="font-mono text-xs font-bold uppercase text-cyan underline underline-offset-4 hover:text-yellow">{{ $t("demos.case") }} →</NuxtLink>
          </footer>
        </article>
      </div>
    </div>
  </section>
</template>
