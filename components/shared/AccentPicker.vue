<script setup lang="ts">
const { t } = useI18n();
const KEY = "accent";
const accents = [
  { id: "cyan", color: "#22d3ee" },
  { id: "mint", color: "#34d399" },
  { id: "pink", color: "#f472b6" },
  { id: "orange", color: "#fb923c" },
] as const;
const current = ref<string>("cyan");

const set = (id: string) => {
  current.value = id;
  if (id === "cyan") document.documentElement.removeAttribute("data-accent");
  else document.documentElement.setAttribute("data-accent", id);
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* storage unavailable */
  }
};

onMounted(() => {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved && accents.some((a) => a.id === saved)) set(saved);
  } catch {
    /* ignore */
  }
});
</script>

<template>
  <div class="hidden lg:flex items-center gap-1.5" role="group" :aria-label="t('accent.label')">
    <button v-for="a in accents" :key="a.id" type="button" :aria-label="t(`accent.names.${a.id}`)" :aria-pressed="current === a.id" :title="t(`accent.names.${a.id}`)" class="h-5 w-5 cursor-pointer border-2 transition-transform hover:-translate-y-0.5" :class="current === a.id ? 'border-white scale-110' : 'border-ink'" :style="{ backgroundColor: a.color }" @click="set(a.id)" />
  </div>
</template>
