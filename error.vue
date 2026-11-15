<script setup lang="ts">
const props = defineProps<{
  error: Error & { statusCode?: number; statusMessage?: string };
}>();

const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const statusCode = computed(() => props.error.statusCode || 404);
const isNotFound = computed(() => statusCode.value === 404);

useHead({
  title: `${statusCode.value} · ${isNotFound.value ? t("error.notFoundTitle") : t("error.errorTitle")}`,
  htmlAttrs: { lang: locale.value },
  meta: [{ name: "robots", content: "noindex" }],
});

const links = computed(() => [
  { to: "/", label: t("nav.home") },
  { to: "/projects", label: t("nav.projects") },
  { to: "/about", label: t("nav.about") },
  { to: "/blog", label: t("nav.blog") },
  { to: "/resume", label: t("resume.title") },
  { to: "/contact", label: t("nav.contact") },
]);

const goHome = () => clearError({ redirect: localePath("/") });
const goTo = (to: string) => clearError({ redirect: localePath(to) });
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-indigo-600 text-white flex items-center">
    <div class="absolute inset-0 grid-overlay--light" />
    <div class="relative mx-auto w-full max-w-[1180px] px-6 py-16 sm:px-10">
      <p class="m-0 inline-block border-2 border-ink bg-yellow px-3 py-1 font-display font-extrabold uppercase text-sm text-ink-text shadow-[4px_4px_0_#0a1420]">{{ $t("error.label") }} {{ statusCode }}</p>

      <h1 class="m-0 mt-6 font-display font-black uppercase leading-[0.85] tracking-[-0.03em] text-[clamp(7rem,28vw,20rem)] [text-shadow:8px_8px_0_#0a1420]">
        {{ statusCode }}
      </h1>

      <h2 class="m-0 mt-4 font-display font-black uppercase tracking-[-0.01em] text-[clamp(1.75rem,4vw,3rem)]">
        {{ isNotFound ? $t("error.notFoundTitle") : $t("error.errorTitle") }}
      </h2>
      <p class="mt-3 max-w-[52ch] text-base text-indigo-50">
        {{ isNotFound ? $t("error.notFoundText") : $t("error.errorText") }}
      </p>

      <p v-if="isNotFound" class="mt-5 max-w-full overflow-x-auto border-2 border-ink bg-ink-text/90 px-4 py-3 font-mono text-sm text-yellow shadow-[6px_6px_0_#0a1420]">
        <span class="text-indigo-200">{{ $t("error.path") }}:</span> {{ route.fullPath }}
      </p>

      <nav class="mt-10 flex flex-wrap gap-4" :aria-label="$t('error.goto')">
        <button type="button" class="font-display font-extrabold uppercase text-base text-ink-text bg-yellow border-2 border-ink px-[30px] py-[18px] shadow-[6px_6px_0_#0a1420] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#0a1420] active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0_#0a1420]" @click="goHome">← {{ $t("error.home") }}</button>
        <button v-for="l in links.slice(1)" :key="l.to" type="button" class="font-display font-extrabold uppercase text-base text-ink-text bg-white border-2 border-ink px-5 py-[18px] shadow-[4px_4px_0_#0a1420] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#0a1420] active:translate-x-0 active:translate-y-0" @click="goTo(l.to)">
          {{ l.label }}
        </button>
      </nav>

      <SharedBugSquash v-if="isNotFound" />

      <p class="mt-8 text-sm text-indigo-100">
        {{ $t("error.hint") }} ·
        <a href="#" class="underline underline-offset-4 hover:text-yellow" @click.prevent="goTo('/contact')">{{ $t("error.report") }}</a>
      </p>
    </div>
  </div>
</template>
