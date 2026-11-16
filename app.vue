<script setup lang="ts">
const appConfig = useAppConfig();

useHead({
  htmlAttrs: {
    lang: appConfig.lang as string,
  },
  title: appConfig.title as string,
});
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.layout-enter-active {
  animation: coming 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-leave-active,
.layout-leave-active {
  animation: going 0.18s ease-in;
}

@keyframes going {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}

@keyframes coming {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
