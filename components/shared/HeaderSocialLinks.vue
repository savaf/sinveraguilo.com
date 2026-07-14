<script setup lang="ts">
const { data } = await useAsyncData("social_links", () => {
  return queryContent("social_links").findOne();
});
</script>

<template>
  <ul class="flex gap-2 sm:gap-4">
    <li v-for="social in data.links" :key="social.id">
      <NuxtLink :href="social.url" target="__blank" class="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 px-2 py-2 cursor-pointer rounded-lg shadow-xs duration-500">
        <span class="sr-only">{{ social.name }}</span>
        <Icon :name="social.icon" class="w-6 h-6" aria-hidden="true" />
      </NuxtLink>
    </li>
  </ul>
</template>
