<script setup lang="ts">
const { data: socialLinks } = await useAsyncData("contact_social_links", () => {
  return queryContent("social_links").findOne();
});

const hoverColor: Record<string, string> = {
  GitHub: "hover:bg-yellow hover:text-ink-text",
  LinkedIn: "hover:bg-cyan hover:text-ink-text",
};
</script>

<template>
  <div>
    <div class="font-mono text-xs text-cyan mb-3.5">{{ $t("contact.label") }}</div>
    <h1 class="m-0 font-display font-black uppercase text-slate-50 leading-[0.9] tracking-[-0.02em] text-[clamp(2.75rem,6vw,4.5rem)]">
      {{ $t("contact.title") }}
    </h1>
    <p class="mt-5 mb-9 text-[17px] leading-relaxed text-slate-300 max-w-[42ch]">{{ $t("contact.intro") }}</p>

    <div class="flex flex-col gap-4">
      <a href="mailto:hello@sinveraguilo.com" class="flex items-center gap-3.5 border-2 border-ink bg-surface p-4 shadow-[5px_5px_0_#22d3ee] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#22d3ee]">
        <span class="flex p-2 bg-cyan text-ink-text border-2 border-ink">
          <Icon name="i-heroicons-envelope" class="w-[18px] h-[18px]" aria-hidden="true" />
        </span>
        <span>
          <span class="block font-mono text-[11px] text-dim uppercase">{{ $t("contact.email") }}</span>
          <span class="block font-grotesk font-semibold text-base text-primary-light">hello@sinveraguilo.com</span>
        </span>
      </a>

      <div class="flex items-center gap-3.5 border-2 border-ink bg-surface p-4">
        <span class="flex p-2 bg-yellow text-ink-text border-2 border-ink">
          <Icon name="i-heroicons-map-pin" class="w-[18px] h-[18px]" aria-hidden="true" />
        </span>
        <span>
          <span class="block font-mono text-[11px] text-dim uppercase">{{ $t("contact.location") }}</span>
          <span class="block font-grotesk font-semibold text-base text-primary-light">Santo Domingo, DO</span>
        </span>
      </div>

      <div class="flex gap-3 mt-1">
        <NuxtLink v-for="social in socialLinks?.links" :key="social.id" :href="social.url" target="_blank" rel="noopener" class="flex border-2 border-ink bg-primary-dark text-primary-light p-3.5 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5" :class="hoverColor[social.name] || 'hover:bg-cyan hover:text-ink-text'">
          <span class="sr-only">{{ social.name }}</span>
          <Icon :name="social.icon" class="w-[22px] h-[22px]" aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
