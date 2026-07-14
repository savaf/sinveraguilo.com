<script setup lang="ts">
const { data: allProjects } = await useAsyncData("detail_more_projects", () => {
  return queryContent("projects").find();
});

const tagAccent = ["bg-yellow", "bg-cyan", "bg-indigo text-white"];
const galleryShadow = ["#22d3ee", "#facc15", "#6366f1"];

function moreProjects(slug: string) {
  return (allProjects.value || []).filter((p: any) => p.slug !== slug).slice(0, 2);
}
</script>

<template>
  <ContentDoc v-slot="{ doc }">
    <div>
      <Head>
        <Title>{{ doc.title }}</Title>
        <Meta name="og:image" :content="doc.image" />
      </Head>

      <!-- Hero -->
      <section class="relative border-b-2 border-ink overflow-hidden">
        <div class="absolute inset-0 grid-overlay" />
        <div class="relative mx-auto max-w-[1180px] px-6 pt-10 pb-14 sm:px-10">
          <NuxtLink to="/projects" class="inline-flex items-center gap-2 font-mono text-[13px] text-muted mb-8 hover:text-cyan">
            <Icon name="i-heroicons-chevron-left" class="w-4 h-4" aria-hidden="true" />
            {{ $t("detail.back") }}
          </NuxtLink>

          <div class="flex flex-wrap justify-between items-end gap-6">
            <div>
              <div class="flex gap-2 mb-4 flex-wrap">
                <span v-for="(tag, i) in doc.tags" :key="tag" class="font-mono text-[11px] text-ink-text px-2.5 py-1" :class="tagAccent[i % tagAccent.length]">
                  {{ tag }}
                </span>
              </div>
              <h1 class="m-0 font-display font-black uppercase text-slate-50 leading-[0.9] tracking-[-0.02em] text-[clamp(2.75rem,6vw,4.5rem)]">
                {{ doc.title }}
              </h1>
              <p class="mt-4 font-mono text-[13px] text-dim">{{ $t("detail.published") }} {{ doc.publishDate }}</p>
            </div>

            <div class="flex flex-wrap gap-3.5">
              <a v-if="doc.previewLink" :href="doc.previewLink" target="_blank" rel="noopener" class="inline-flex items-center gap-2 font-display font-extrabold uppercase text-sm text-white bg-indigo border-2 border-ink px-[22px] py-3.5 shadow-[5px_5px_0_#22d3ee] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#22d3ee]">
                <Icon name="i-heroicons-arrow-top-right-on-square" class="w-[18px] h-[18px]" aria-hidden="true" />
                {{ $t("detail.live") }}
              </a>
              <a v-if="doc.codeLink" :href="doc.codeLink" target="_blank" rel="noopener" class="inline-flex items-center gap-2 font-display font-extrabold uppercase text-sm text-primary-light bg-surface border-2 border-ink px-[22px] py-3.5 transition-all hover:bg-yellow hover:text-ink-text">
                {{ $t("detail.code") }}
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Gallery -->
      <section v-if="doc.projectImages?.length" class="mx-auto max-w-[1180px] px-6 pt-14 sm:px-10">
        <div class="border-2 border-ink" :style="{ boxShadow: `10px 10px 0 ${galleryShadow[2]}` }">
          <NuxtImg :src="doc.projectImages[0].img" :alt="doc.projectImages[0].title" width="1120" height="600" class="w-full block" />
        </div>
        <div v-if="doc.projectImages.length > 1" class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div v-for="(img, i) in doc.projectImages.slice(1)" :key="img.id" class="border-2 border-ink" :style="{ boxShadow: `8px 8px 0 ${galleryShadow[i % galleryShadow.length]}` }">
            <NuxtImg :src="img.img" :alt="img.title" width="550" height="360" class="w-full h-full object-cover block" />
          </div>
        </div>
      </section>

      <!-- Overview + tech -->
      <section class="mx-auto max-w-[1180px] px-6 pt-16 pb-8 sm:px-10 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-14">
        <div>
          <h2 class="m-0 mb-4 font-display font-black text-[32px] uppercase text-slate-50">{{ $t("detail.overview") }}</h2>
          <ContentRenderer :value="doc" class="prose prose-invert prose-slate max-w-none prose-headings:font-display prose-headings:uppercase prose-a:text-cyan" />
        </div>
        <div>
          <h3 class="m-0 mb-4 font-mono text-[13px] text-cyan uppercase tracking-[0.06em]">{{ $t("detail.tech") }}</h3>
          <div class="flex flex-wrap gap-2.5">
            <span v-for="tech in doc.technologies" :key="tech" class="font-mono text-[13px] text-slate-200 border-2 border-ink bg-surface px-3.5 py-[7px]">
              {{ tech }}
            </span>
          </div>
        </div>
      </section>

      <!-- More projects -->
      <section class="mx-auto max-w-[1180px] px-6 pt-10 pb-18 sm:px-10">
        <div class="flex items-center gap-4 mb-8">
          <h2 class="m-0 font-display font-black text-[32px] uppercase text-slate-50">{{ $t("detail.more") }}</h2>
          <div class="flex-1 h-0.5 bg-ink" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ProjectsCard v-for="(project, i) in moreProjects(doc.slug)" :key="project._path" :project="project" :accent="projectAccent(i + 1)" :subtitle="`${projectCategory(project).toLowerCase()}/ · ${projectStack(project)}`" subtitle-class="text-yellow" img-class="h-[170px]" />
        </div>
      </section>

      <SharedCtaBand />
    </div>
  </ContentDoc>
</template>
