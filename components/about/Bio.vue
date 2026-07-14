<script setup lang="ts">
const { data: socialLinks } = await useAsyncData("about_social_links", () => {
  return queryContent("social_links").findOne();
});

const hoverColor: Record<string, string> = {
  GitHub: "hover:bg-yellow hover:text-ink-text",
  LinkedIn: "hover:bg-cyan hover:text-ink-text",
};
</script>

<template>
  <section class="relative border-b-2 border-ink overflow-hidden">
    <div class="absolute inset-0 grid-overlay" />
    <div class="relative mx-auto max-w-[1180px] grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr]">
      <div class="px-6 py-14 sm:px-10 sm:py-16 md:border-r-2 border-ink">
        <div class="font-mono text-xs text-cyan mb-4">{{ $t("about.label") }}</div>
        <h1 class="m-0 mb-7 font-display font-black uppercase text-slate-50 leading-[0.92] tracking-[-0.02em] text-[clamp(2.75rem,6vw,4.5rem)]">
          {{ $t("about.title") }}
        </h1>
        <div class="flex flex-col gap-5 text-[16.5px] leading-relaxed text-slate-300 max-w-[62ch]">
          <p class="m-0">{{ $t("about.bio1") }}</p>
          <p class="m-0">{{ $t("about.bio2") }}</p>
          <p class="m-0">{{ $t("about.bio3") }}</p>
        </div>
        <div class="flex flex-wrap gap-3.5 mt-8">
          <NuxtLink v-for="social in socialLinks?.links" :key="social.id" :href="social.url" target="_blank" rel="noopener" class="inline-flex items-center gap-2.5 font-mono text-[13px] border-2 border-ink bg-surface px-4 py-2.5 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5" :class="hoverColor[social.name] || 'hover:bg-cyan hover:text-ink-text'">
            <Icon :name="social.icon" class="w-[18px] h-[18px]" aria-hidden="true" />
            {{ social.name }}
          </NuxtLink>
        </div>
      </div>

      <div class="relative flex items-stretch bg-surface min-h-[360px]">
        <NuxtImg src="/images/portrait.jpg" alt="Sinver Aguiló" width="480" height="522" class="w-full object-cover grayscale contrast-[1.05]" />
        <div class="absolute left-0 bottom-0 font-mono font-bold text-xs text-ink-text bg-yellow px-3.5 py-2 border-t-2 border-r-2 border-ink">
          {{ $t("about.location") }}
        </div>
      </div>
    </div>
  </section>
</template>
