<script setup lang="ts">
// Brutalist route-change curtain: five hard-edged bars wipe up over the page,
// name the destination, then lift away once the new route has rendered.
const router = useRouter();
const phase = ref<"idle" | "in" | "out">("idle");
const label = ref("");
let timer: ReturnType<typeof setTimeout> | undefined;

const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

onMounted(() => {
  const stopBefore = router.beforeEach((to, from) => {
    if (to.path === from.path || reduce()) return;
    clearTimeout(timer);
    label.value = to.path === "/" ? "/home" : to.path;
    phase.value = "in";
  });
  const stopAfter = router.afterEach((to, from, failure) => {
    if (phase.value !== "in") return;
    clearTimeout(timer);
    // Cover the page leave + enter animations, then lift.
    timer = setTimeout(() => (phase.value = "out"), failure ? 0 : 320);
    setTimeout(() => phase.value === "out" && (phase.value = "idle"), failure ? 450 : 800);
  });
  onBeforeUnmount(() => {
    stopBefore();
    stopAfter();
    clearTimeout(timer);
  });
});
</script>

<template>
  <div class="curtain" :data-phase="phase" aria-hidden="true">
    <span v-for="i in 5" :key="i" class="curtain-bar" :class="i % 2 ? 'bg-yellow' : 'bg-cyan'" :style="{ '--i': i - 1 }" />
    <span class="curtain-label font-mono font-black uppercase text-ink-text bg-white border-2 border-ink px-4 py-2 text-sm sm:text-xl">→ {{ label }}</span>
  </div>
</template>

<style scoped>
.curtain {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  pointer-events: none;
  visibility: hidden;
}
.curtain:not([data-phase="idle"]) {
  visibility: visible;
}
.curtain-bar {
  flex: 1;
  transform: scaleY(0);
  transform-origin: bottom;
  border-right: 2px solid #000;
  transition: transform 0.26s cubic-bezier(0.7, 0, 0.2, 1) calc(var(--i) * 30ms);
}
.curtain[data-phase="in"] .curtain-bar {
  transform: scaleY(1);
}
.curtain[data-phase="out"] .curtain-bar {
  transform: scaleY(0);
  transform-origin: top;
}
.curtain-label {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  opacity: 0;
  transition: opacity 0.1s;
}
.curtain[data-phase="in"] .curtain-label {
  opacity: 1;
  transition-delay: 0.2s;
}
@media (prefers-reduced-motion: reduce) {
  .curtain {
    display: none;
  }
}
</style>
