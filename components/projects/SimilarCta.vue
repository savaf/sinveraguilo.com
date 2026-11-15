<script setup lang="ts">
// Sticky bar on a project page: after the visitor scrolls past the hero it offers
// to start a similar project, with the contact form prefilled from this project.
const props = defineProps<{ title: string; technologies?: string[] }>();
const { t } = useI18n();
const localePath = useLocalePath();
const shown = ref(false);
const dismissed = ref(false);

function onScroll() {
  shown.value = window.scrollY > 600;
}
onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));

const query = computed(() => ({
  subject: t("similar.subject", { title: props.title }).slice(0, 120),
  message: t("similar.message", { title: props.title, stack: (props.technologies || []).slice(0, 5).join(", ") }),
}));
</script>

<template>
  <Transition name="fade">
    <div v-if="shown && !dismissed" class="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-[640px] -translate-x-1/2 flex items-center gap-3 border-2 border-ink bg-surface p-3 shadow-[6px_6px_0_#22d3ee]" role="complementary" :aria-label="t('similar.title')">
      <p class="m-0 flex-1 font-display text-sm font-extrabold uppercase leading-tight text-slate-50">{{ t("similar.title") }}</p>
      <NuxtLink :to="{ path: localePath('/contact'), query }" class="shrink-0 border-2 border-ink bg-yellow px-4 py-2 font-display text-xs font-extrabold uppercase text-ink-text">{{ t("similar.cta") }} →</NuxtLink>
      <button type="button" class="shrink-0 h-8 w-8 font-mono text-muted hover:text-cyan cursor-pointer" :aria-label="t('detail.close')" @click="dismissed = true">×</button>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}
</style>
