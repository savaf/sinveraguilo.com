<script setup lang="ts">
const route = useRoute();

const { data: doc } = await useAsyncData(`blog:${route.path}`, () => {
  return queryContent(route.path).findOne();
});

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: "Post not found" });
}

const tagAccent = ["bg-yellow", "bg-cyan", "bg-indigo text-white"];

useHead({
  title: doc.value?.title,
});
useSeoMeta({
  description: () => doc.value?.description,
  ogTitle: () => doc.value?.title,
  ogDescription: () => doc.value?.description,
  ogImage: () => doc.value?.image,
});
</script>

<template>
  <div v-if="doc">
    <!-- Hero -->
    <section class="relative border-b-2 border-ink overflow-hidden">
      <div class="absolute inset-0 grid-overlay" />
      <div class="relative mx-auto max-w-[820px] px-6 pt-10 pb-14 sm:px-10">
        <NuxtLink to="/blog" class="inline-flex items-center gap-2 font-mono text-[13px] text-muted mb-8 hover:text-cyan">
          <Icon name="i-heroicons-chevron-left" class="w-4 h-4" aria-hidden="true" />
          {{ $t("blog.back") }}
        </NuxtLink>

        <div v-if="doc.tags?.length" class="flex gap-2 mb-4 flex-wrap">
          <span v-for="(tag, i) in doc.tags" :key="tag" class="font-mono text-[11px] text-ink-text px-2.5 py-1" :class="tagAccent[i % tagAccent.length]">
            {{ tag }}
          </span>
        </div>
        <h1 class="m-0 font-display font-black uppercase text-slate-50 leading-[0.9] tracking-[-0.02em] text-[clamp(2.25rem,5vw,3.75rem)]">
          {{ doc.title }}
        </h1>
        <p class="mt-4 font-mono text-[13px] text-dim">{{ $t("blog.published") }} {{ doc.publishDate }}</p>
      </div>
    </section>

    <!-- Body -->
    <section class="mx-auto max-w-[820px] px-6 pt-14 pb-8 sm:px-10">
      <ContentRenderer :value="doc" class="prose prose-invert prose-slate max-w-none prose-headings:font-display prose-headings:uppercase prose-a:text-cyan" />
    </section>

    <SharedCtaBand />
  </div>
</template>
