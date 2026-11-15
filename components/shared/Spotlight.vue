<script setup lang="ts">
// Spotlight mode: the page dims to near-black and only a circle around the
// cursor stays lit, so a visitor reads one thing at a time. Toggle with L.
const { t } = useI18n();
const on = ref(false);
const x = ref(-999);
const y = ref(-999);

function onKey(e: KeyboardEvent) {
  if (e.key.toLowerCase() !== "l" || e.metaKey || e.ctrlKey || e.altKey) return;
  const el = e.target as HTMLElement | null;
  if (el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))) return;
  on.value = !on.value;
}
function onMove(e: PointerEvent) {
  x.value = e.clientX;
  y.value = e.clientY;
}

onMounted(() => {
  window.addEventListener("keydown", onKey);
  window.addEventListener("pointermove", onMove, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  window.removeEventListener("pointermove", onMove);
});
</script>

<template>
  <button type="button" class="hidden lg:inline-flex h-7 items-center border-2 px-2 font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer" :class="on ? 'border-yellow bg-yellow text-ink-text' : 'border-ink text-muted hover:text-cyan'" :aria-pressed="on" :title="t('spotlight.hint')" :aria-label="t('spotlight.hint')" @click="on = !on">
    {{ t("spotlight.label") }}
  </button>
  <Teleport to="body">
    <div v-if="on" aria-hidden="true" class="pointer-events-none fixed inset-0 z-[60]" :style="{ background: `radial-gradient(circle 220px at ${x}px ${y}px, transparent 0, transparent 35%, rgba(0,0,0,.93) 100%)` }" />
  </Teleport>
</template>
