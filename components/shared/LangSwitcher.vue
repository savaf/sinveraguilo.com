<script setup lang="ts">
const { locale, setLocale } = useI18n();
const langs = ["en", "es"] as const;
</script>

<template>
  <div class="flex border-2 border-ink">
    <button v-for="l in langs" :key="l" type="button" class="font-display font-extrabold text-xs px-3 py-[7px] uppercase cursor-pointer transition-colors" :class="locale === l ? 'bg-cyan text-ink-text' : 'bg-primary-dark text-muted hover:text-white'" :aria-pressed="locale === l" @click="setLocale(l)">
      {{ l.toUpperCase() }}
    </button>
  </div>
</template>
