<script setup lang="ts">
const { data: posts } = await useAsyncData("all_posts", () => {
  return queryContent("blog").find();
});

// Newest first — files are numbered chronologically (1., 2., ...).
const ordered = computed(() => (posts.value || []).slice().reverse());

const query = ref("");
const tag = ref("");

const tags = computed(() => [...new Set(ordered.value.flatMap((p: any) => p.tags || []))].sort());

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return ordered.value.filter((p: any) => {
    if (tag.value && !(p.tags || []).includes(tag.value)) return false;
    return !q || `${p.title} ${p.description} ${(p.tags || []).join(" ")}`.toLowerCase().includes(q);
  });
});
const featured = computed(() => filtered.value[0]);
const rest = computed(() => filtered.value.slice(1));
const pad = (i: number) => String(i).padStart(2, "0");
</script>

<template>
  <div>
    <section class="relative border-b-2 border-ink overflow-hidden">
      <div class="absolute inset-0 grid-overlay" />
      <div class="relative mx-auto max-w-[1180px] px-6 py-16 sm:px-10">
        <h1 class="m-0 font-display font-black uppercase text-slate-50 leading-[0.9] tracking-[-0.02em] text-[clamp(3rem,7vw,5rem)]">
          {{ $t("blog.title") }}
        </h1>
        <p class="mt-5 text-[17px] leading-relaxed text-slate-300 max-w-[56ch]">{{ $t("blog.subtitle") }}</p>
      </div>
    </section>

    <section class="mx-auto max-w-[1180px] px-6 py-12 sm:px-10">
      <div v-if="ordered.length">
        <div class="flex flex-wrap items-center gap-3 mb-8">
          <input v-model="query" type="search" :placeholder="$t('blog.search')" :aria-label="$t('blog.search')" class="min-w-[220px] flex-1 border-2 border-ink bg-transparent px-4 py-2 font-mono text-sm text-slate-50 placeholder:text-dim focus:outline-none focus:border-yellow" />
          <div class="flex flex-wrap gap-2">
            <button v-for="t in ['', ...tags]" :key="t" type="button" :aria-pressed="tag === t" class="border-2 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors" :class="tag === t ? 'border-yellow bg-yellow text-black' : 'border-ink text-slate-300 hover:border-yellow'" @click="tag = t">
              {{ t || $t("blog.all") }}
            </button>
          </div>
        </div>

        <template v-if="featured">
          <NuxtLink :to="`/blog/${featured.slug}`" class="group block border-2 border-ink p-6 sm:p-10 hover:border-yellow transition-colors">
            <div class="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-dim">
              <span class="bg-yellow px-2 py-0.5 text-black font-bold">{{ $t("blog.latest") }}</span>
              <span>{{ featured.publishDate }}</span>
              <span>{{ featured.lang === "en" ? "EN" : "ES" }}</span>
            </div>
            <h2 class="mt-5 mb-0 font-display font-black uppercase leading-[0.95] tracking-[-0.02em] text-slate-50 text-[clamp(1.75rem,4vw,3rem)] group-hover:text-yellow transition-colors">
              {{ featured.title }}
            </h2>
            <p class="mt-4 max-w-[70ch] text-[16px] leading-relaxed text-slate-300">{{ featured.description }}</p>
            <div class="mt-5 flex flex-wrap items-center gap-2">
              <span v-for="t in featured.tags" :key="t" class="border border-ink px-2 py-0.5 font-mono text-xs text-dim">{{ t }}</span>
              <span class="ml-auto font-mono text-sm text-yellow group-hover:translate-x-1 transition-transform">{{ $t("blog.open") }} →</span>
            </div>
          </NuxtLink>

          <ul v-if="rest.length" class="m-0 mt-8 list-none p-0 border-t-2 border-ink">
            <li v-for="(post, i) in rest" :key="post._path" class="border-b-2 border-ink">
              <NuxtLink :to="`/blog/${post.slug}`" class="group grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-1 py-5 hover:bg-white/5 transition-colors">
                <span class="font-mono text-sm text-yellow">{{ pad(rest.length - i) }}</span>
                <span class="font-display font-bold text-xl text-slate-50 group-hover:text-yellow transition-colors">{{ post.title }}</span>
                <span class="col-start-2 sm:col-start-3 font-mono text-xs uppercase text-dim">{{ post.publishDate }} · {{ post.lang === "en" ? "EN" : "ES" }}</span>
              </NuxtLink>
            </li>
          </ul>
        </template>
        <div v-else class="text-center py-16 font-mono text-dim">{{ $t("blog.noResults") }}</div>
      </div>
      <div v-else class="text-center py-16 font-mono text-dim">{{ $t("blog.empty") }}</div>
    </section>

    <SharedCtaBand />
  </div>
</template>
