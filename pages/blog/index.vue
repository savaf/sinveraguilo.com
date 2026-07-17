<script setup lang="ts">
const { data: posts } = await useAsyncData("all_posts", () => {
  return queryContent("blog").find();
});

// Newest first — files are numbered chronologically (1., 2., ...).
const ordered = computed(() => (posts.value || []).slice().reverse());
</script>

<template>
  <div>
    <section class="relative border-b-2 border-ink overflow-hidden">
      <div class="absolute inset-0 grid-overlay" />
      <div class="relative mx-auto max-w-[1180px] px-6 py-16 sm:px-10">
        <div class="font-mono text-xs text-cyan mb-3.5">{{ $t("blog.label") }}</div>
        <h1 class="m-0 font-display font-black uppercase text-slate-50 leading-[0.9] tracking-[-0.02em] text-[clamp(3rem,7vw,5rem)]">
          {{ $t("blog.title") }}
        </h1>
        <p class="mt-5 text-[17px] leading-relaxed text-slate-300 max-w-[56ch]">{{ $t("blog.subtitle") }}</p>
      </div>
    </section>

    <section class="mx-auto max-w-[1180px] px-6 py-12 sm:px-10">
      <div v-if="ordered.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectsCard v-for="(post, i) in ordered" :key="post._path" :project="post" :to="`/blog/${post.slug}`" :accent="projectAccent(i)" :subtitle="post.publishDate" subtitle-class="text-yellow" />
      </div>
      <div v-else class="text-center py-16 font-mono text-dim">{{ $t("blog.empty") }}</div>
    </section>

    <SharedCtaBand />
  </div>
</template>
