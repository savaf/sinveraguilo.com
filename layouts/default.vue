<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()

function titleTemplate(title) {
  return title !== (appConfig.title as string) ? `${appConfig.title} · ${title}` : title
}

let seoMetaOptions: Record<string, string> = {
  title: titleTemplate(route.meta.title || appConfig.title),
  url: appConfig.url + route.path,
  description: route.meta.description as string || appConfig.description,
  icon: '/images/og-logo.png',
}

const ogImage =  route.meta.image ?  route.meta.image : '/images/og-image.png'
seoMetaOptions.ogImage = ogImage
seoMetaOptions.twitterImage = ogImage

useSeoMeta({
  ...seoMetaOptions,
  ogTitle: seoMetaOptions.title,
  ogDescription: seoMetaOptions.description,
  ogUrl: seoMetaOptions.url,

  twitterTitle: seoMetaOptions.title,
  twitterDescription: seoMetaOptions.description,
  twitterCard: 'summary'
})
</script>

<template>
  <div class="bg-primary-dark min-h-screen flex flex-col backdrop-blur-md">
    <SharedAppHeader />
    <slot />

    <LazySharedAppFooter />

    <!-- Go back to top when scrolled down -->
    <div class="flex space-x-2 mr-8 mb-6 right-0 bottom-0 z-50 fixed items-center sm:space-x-4">
      <LazyBackToTop />
    </div>
  </div>
</template>
