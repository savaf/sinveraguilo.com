<script setup lang="ts">
const localePath = useLocalePath();
const EMAIL = "hello@sinveraguilo.com";
const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

const { data: socialLinks } = await useAsyncData("social_links", () => {
  return queryContent("social_links").findOne();
});

// Map social names to their brand hover color
const hoverColor: Record<string, string> = {
  GitHub: "hover:bg-yellow hover:text-ink-text",
  LinkedIn: "hover:bg-cyan hover:text-ink-text",
};

const pages = [
  { key: "nav.home", to: "/" },
  { key: "nav.about", to: "/about" },
  { key: "nav.projects", to: "/projects" },
  { key: "nav.blog", to: "/blog" },
  { key: "nav.contact", to: "/contact" },
];

async function copyEmail() {
  try {
    await navigator.clipboard?.writeText(EMAIL);
    copied.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), 2000);
  } catch {
    window.location.href = `mailto:${EMAIL}`;
  }
}
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <footer class="relative overflow-hidden border-t-2 border-ink bg-footer-dark">
    <div class="mx-auto max-w-[1180px] px-6 pt-14 sm:px-10">
      <div class="flex flex-wrap items-end justify-between gap-8">
        <div>
          <p class="m-0 font-mono text-[13px] text-cyan">{{ $t("footer.emailLabel") }}</p>
          <div class="mt-3 flex flex-wrap items-stretch border-2 border-ink shadow-[6px_6px_0_#22d3ee]">
            <a :href="`mailto:${EMAIL}`" class="bg-surface px-5 py-3.5 font-mono text-sm text-slate-50 hover:text-yellow break-all">{{ EMAIL }}</a>
            <button type="button" class="border-l-2 border-ink bg-yellow px-5 py-3.5 font-display text-sm font-extrabold uppercase text-ink-text transition-colors hover:bg-cyan" aria-live="polite" @click="copyEmail">
              {{ copied ? $t("footer.copied") : $t("footer.copy") }}
            </button>
          </div>
        </div>

        <nav :aria-label="$t('footer.pages')" class="flex flex-wrap gap-x-5 gap-y-2 font-display text-[13px] font-bold uppercase">
          <NuxtLink v-for="p in pages" :key="p.to" :to="localePath(p.to)" class="text-primary-light hover:text-yellow">{{ $t(p.key) }}</NuxtLink>
        </nav>
      </div>

      <!-- Oversized outlined wordmark, cropped by the bottom edge -->
      <div aria-hidden="true" class="wordmark mt-12 -mb-[0.16em] select-none whitespace-nowrap text-center font-display font-black uppercase leading-[0.85] tracking-[-0.03em] text-[clamp(2.75rem,12.5vw,9.5rem)]">Sinver Aguiló</div>
    </div>

    <div class="relative border-t-2 border-ink bg-footer-dark">
      <div class="mx-auto max-w-[1180px] px-6 py-5 sm:px-10 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <img src="/images/logo.png" alt="Sinver Aguiló" class="h-8" width="32" height="32" />
          <span class="font-mono text-dim text-[13px]">© 2026 · Sinver Aguiló</span>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink v-for="social in socialLinks?.links" :key="social.id" :href="social.url" target="_blank" rel="noopener" class="flex border-2 border-ink bg-primary-dark text-primary-light p-2.5 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5" :class="hoverColor[social.name] || 'hover:bg-cyan hover:text-ink-text'">
            <span class="sr-only">{{ social.name }}</span>
            <Icon :name="social.icon" class="w-5 h-5" aria-hidden="true" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.wordmark {
  color: transparent;
  -webkit-text-stroke: 2px #22d3ee;
  transition: color 0.3s ease;
}
.wordmark:hover {
  color: #facc15;
}
</style>
