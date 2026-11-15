<script setup lang="ts">
const appConfig = useAppConfig();
const route = useRoute();
const { t } = useI18n();

function titleTemplate(title: string) {
  return title !== (appConfig.title as string) ? `${appConfig.title} · ${title}` : title;
}

const pageTitle = computed(() => (route.meta.title ? t(route.meta.title as string) : (appConfig.title as string)));
const pageDescription = computed(() => (route.meta.description ? t(route.meta.description as string) : t("seo.description")));
const fullTitle = computed(() => titleTemplate(pageTitle.value));
const pageUrl = computed(() => appConfig.url + route.path);
const ogImage = computed(() => (route.meta.image ? (route.meta.image as string) : "/images/og-image.png"));

useSeoMeta({
  title: () => fullTitle.value,
  url: () => pageUrl.value,
  description: () => pageDescription.value,
  icon: "/images/og-logo.png",
  ogImage: () => ogImage.value,
  twitterImage: () => ogImage.value,
  ogTitle: () => fullTitle.value,
  ogDescription: () => pageDescription.value,
  ogUrl: () => pageUrl.value,
  twitterTitle: () => fullTitle.value,
  twitterDescription: () => pageDescription.value,
  twitterCard: "summary",
});

// hreflang alternates + locale-aware <html lang>, canonical, og:locale
const i18nHead = useLocaleHead({ addSeoAttributes: true });
useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs,
  link: i18nHead.value.link,
  meta: i18nHead.value.meta,
}));
</script>

<template>
  <div class="bg-primary-dark min-h-screen flex flex-col text-primary-light">
    <SharedAppHeader />
    <main class="flex-1">
      <slot />
    </main>

    <LazySharedAppFooter />

    <ClientOnly><SharedPageCurtain /></ClientOnly>
    <ClientOnly><SharedShortcuts /></ClientOnly>

    <!-- Go back to top when scrolled down -->
    <div class="flex space-x-2 mr-8 mb-6 right-0 bottom-0 z-50 fixed items-center sm:space-x-4">
      <LazyBackToTop />
    </div>
  </div>
</template>
