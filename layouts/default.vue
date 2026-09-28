<script setup lang="ts">
const appConfig = useAppConfig();
const route = useRoute();
const { t } = useI18n();

function titleTemplate(title: string) {
  return title !== (appConfig.title as string) ? `${appConfig.title} · ${title}` : title;
}

const pageTitle = route.meta.title ? t(route.meta.title as string) : (appConfig.title as string);
const pageDescription = route.meta.description ? t(route.meta.description as string) : t("seo.description");

let seoMetaOptions: Record<string, string> = {
  title: titleTemplate(pageTitle),
  url: appConfig.url + route.path,
  description: pageDescription,
  icon: "/images/og-logo.png",
};

const ogImage = route.meta.image ? route.meta.image : "/images/og-image.png";
seoMetaOptions.ogImage = ogImage;
seoMetaOptions.twitterImage = ogImage;

useSeoMeta({
  ...seoMetaOptions,
  ogTitle: seoMetaOptions.title,
  ogDescription: seoMetaOptions.description,
  ogUrl: seoMetaOptions.url,

  twitterTitle: seoMetaOptions.title,
  twitterDescription: seoMetaOptions.description,
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

    <!-- Go back to top when scrolled down -->
    <div class="flex space-x-2 mr-8 mb-6 right-0 bottom-0 z-50 fixed items-center sm:space-x-4">
      <LazyBackToTop />
    </div>
  </div>
</template>
