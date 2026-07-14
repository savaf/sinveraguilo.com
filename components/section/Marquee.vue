<script setup lang="ts">
const items = ["Corotos", "NZXT", "Crunchyroll", "Microservices", "Vue.js", "9+ Years"];
</script>

<template>
  <div class="border-b-2 border-ink bg-yellow overflow-hidden whitespace-nowrap py-3 font-display font-extrabold uppercase text-sm text-ink-text">
    <div class="inline-block animate-marquee">
      <span v-for="n in 2" :key="n">
        <span v-for="item in items" :key="`${n}-${item}`" class="mx-4">{{ item }}&nbsp;&nbsp;✦</span>
      </span>
    </div>
  </div>
</template>
