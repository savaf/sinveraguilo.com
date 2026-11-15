<script setup lang="ts">
// Live "minutes left" pill for a post, based on scroll progress through the body.
const props = defineProps<{ minutes: number; target: string }>();
const { t } = useI18n();

const progress = ref(0);
const visible = ref(false);
let raf = 0;

function update() {
  raf = 0;
  const el = document.querySelector(props.target) as HTMLElement | null;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const total = rect.height - window.innerHeight * 0.5;
  const read = window.innerHeight * 0.5 - rect.top;
  progress.value = total > 0 ? Math.min(1, Math.max(0, read / total)) : 0;
  visible.value = rect.top < window.innerHeight * 0.3;
}
function onScroll() {
  if (!raf) raf = requestAnimationFrame(update);
}
const left = computed(() => Math.max(1, Math.ceil(props.minutes * (1 - progress.value))));
const done = computed(() => progress.value >= 0.97);

onMounted(() => {
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  if (raf) cancelAnimationFrame(raf);
});
</script>

<template>
  <transition name="fade">
    <div v-if="visible" role="status" aria-live="off" class="print:hidden pointer-events-none fixed bottom-4 left-1/2 z-30 -translate-x-1/2 border-2 border-ink bg-surface px-4 py-2 font-mono text-[12px] uppercase text-slate-50 shadow-[4px_4px_0_var(--accent)]">
      <span class="text-cyan">{{ Math.round(progress * 100) }}%</span>
      <span class="mx-2 text-dim">·</span>
      <span>{{ done ? t("timeLeft.done") : t("timeLeft.left", { n: left }) }}</span>
    </div>
  </transition>
</template>
