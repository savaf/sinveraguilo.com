<script setup lang="ts">
const { data: socialLinks } = await useAsyncData("social_links", () => {
  return queryContent("social_links").findOne();
});

// Map social names to their brand hover color
const hoverColor: Record<string, string> = {
  GitHub: "hover:bg-yellow hover:text-ink-text",
  LinkedIn: "hover:bg-cyan hover:text-ink-text",
};
</script>

<template>
  <footer class="border-t-2 border-ink bg-footer-dark">
    <div class="mx-auto max-w-[1180px] px-6 py-14 sm:px-10 flex flex-wrap items-center justify-between gap-6">
      <div class="flex items-center gap-3.5">
        <img src="/images/logo.png" alt="Sinver Aguiló" class="h-11" width="44" height="44" />
        <span class="font-mono text-dim text-[13px]">© 2026 · Sinver Aguiló</span>
      </div>

      <div class="flex items-center gap-4">
        <span class="font-display font-extrabold uppercase text-[13px] text-muted">{{ $t("footer.follow") }}</span>
        <NuxtLink v-for="social in socialLinks?.links" :key="social.id" :href="social.url" target="_blank" rel="noopener" class="flex border-2 border-ink bg-primary-dark text-primary-light p-3 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5" :class="hoverColor[social.name] || 'hover:bg-cyan hover:text-ink-text'">
          <span class="sr-only">{{ social.name }}</span>
          <Icon :name="social.icon" class="w-[22px] h-[22px]" aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
