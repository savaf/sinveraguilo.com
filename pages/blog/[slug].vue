<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();

const { data: doc } = await useAsyncData(`blog:${route.params.slug}`, () => {
  return queryContent("blog").where({ slug: route.params.slug }).findOne();
});

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: "Post not found" });
}

// Words in the rendered body (AST text nodes) -> minutes at ~220 wpm.
const readMinutes = computed(() => {
  let words = 0;
  const walk = (n: any) => {
    if (n.type === "text") words += (n.value || "").trim().split(/\s+/).filter(Boolean).length;
    (n.children || []).forEach(walk);
  };
  if (doc.value?.body) walk(doc.value.body);
  return Math.max(1, Math.round(words / 220));
});

const { data: others } = await useAsyncData(`blog:next:${route.params.slug}`, () =>
  queryContent("blog")
    .where({ slug: { $ne: route.params.slug } })
    .find(),
);
// Newest remaining post (files are numbered chronologically).
const nextPost = computed(() => (others.value || []).slice().reverse()[0]);

// Fixed reading-progress bar across the top of the viewport.
const readProgress = ref(0);
function onScroll() {
  const el = document.documentElement;
  const max = el.scrollHeight - window.innerHeight;
  readProgress.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}
onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));

const tagAccent = ["bg-yellow", "bg-cyan", "bg-indigo-600 text-white"];

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
    <div class="fixed top-0 inset-x-0 z-50 h-1 pointer-events-none" aria-hidden="true">
      <div class="h-full bg-yellow origin-left" :style="{ width: `${readProgress * 100}%` }" />
    </div>
    <ClientOnly><SharedTimeLeft :minutes="readMinutes" target="#post-body" /></ClientOnly>
    <ClientOnly><SharedResumeReading :id="String(route.params.slug)" /></ClientOnly>
    <!-- Hero -->
    <section class="relative border-b-2 border-ink overflow-hidden">
      <div class="absolute inset-0 grid-overlay" />
      <div class="relative mx-auto max-w-[820px] px-6 pt-10 pb-14 sm:px-10">
        <NuxtLink :to="localePath('/blog')" class="inline-flex items-center gap-2 font-mono text-[13px] text-muted mb-8 hover:text-cyan">
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
        <p class="mt-4 font-mono text-[13px] text-dim">{{ $t("blog.published") }} {{ doc.publishDate }} · {{ $t("blog.readTime", { n: readMinutes }) }}</p>
        <SharedReadAloud target="#post-body" />
        <SharedReadFocus target="#post-body" />
      </div>
    </section>

    <!-- Body + contents rail -->
    <section class="mx-auto max-w-[1180px] px-6 pt-14 pb-8 sm:px-10 grid grid-cols-1 lg:grid-cols-[minmax(0,820px)_1fr] gap-10 lg:gap-14">
      <div>
        <p v-if="locale !== 'en'" class="font-mono text-xs text-dim mb-4">{{ $t("detail.englishOnly") }}</p>
        <SharedQuoteShare id="post-body">
          <SharedCodeCopy>
            <ContentRenderer :value="doc" class="prose prose-invert prose-slate max-w-none prose-headings:font-display prose-headings:uppercase prose-a:text-cyan" />
          </SharedCodeCopy>
        </SharedQuoteShare>
        <p class="mt-6 font-mono text-xs text-dim">{{ $t("quote.hint") }}</p>
      </div>
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <ProjectsCaseToc :links="doc.body?.toc?.links || []" />
      </aside>
    </section>

    <!-- Keep reading -->
    <section v-if="nextPost" class="mx-auto max-w-[1180px] px-6 pb-14 sm:px-10">
      <NuxtLink :to="localePath(`/blog/${nextPost.slug}`)" class="group block border-2 border-ink bg-surface p-6 sm:p-8 shadow-[6px_6px_0_#22d3ee] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#22d3ee]">
        <span class="font-mono text-[13px] text-cyan uppercase tracking-[0.06em]">{{ $t("blog.next") }}</span>
        <span class="mt-2 block font-display font-black uppercase text-slate-50 text-[clamp(1.4rem,3vw,2rem)] leading-[0.95] group-hover:text-yellow">{{ nextPost.title }} →</span>
        <span class="mt-3 block font-mono text-xs text-dim">{{ nextPost.publishDate }}</span>
      </NuxtLink>
    </section>

    <SharedCtaBand />
  </div>
</template>
