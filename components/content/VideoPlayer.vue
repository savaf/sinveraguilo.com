<script setup lang="ts">
defineProps<{
  src: string;
  poster?: string;
}>();
</script>

<template>
  <div class="not-prose my-6 border-2 border-ink" style="box-shadow: 8px 8px 0 #22d3ee">
    <video
      :src="src"
      :poster="poster"
      controls
      playsinline
      preload="none"
      width="1920"
      height="1080"
      class="w-full h-auto block bg-ink"
    />
  </div>
</template>
