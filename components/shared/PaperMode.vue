<script setup lang="ts">
// Light "paper" theme: the dark palette is inverted in CSS (see main.css), so
// every hard-coded colour flips together. Restored pre-paint by a head script.
const { t } = useI18n();
const KEY = "paper";
const on = ref(false);

const set = (v: boolean) => {
  on.value = v;
  document.documentElement.toggleAttribute("data-paper", v);
  try {
    localStorage.setItem(KEY, v ? "1" : "0");
  } catch {
    /* storage unavailable */
  }
};

function onKey(e: KeyboardEvent) {
  if (e.key.toLowerCase() !== "p" || e.metaKey || e.ctrlKey || e.altKey) return;
  const el = e.target as HTMLElement | null;
  if (el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))) return;
  set(!on.value);
}

onMounted(() => {
  on.value = document.documentElement.hasAttribute("data-paper");
  window.addEventListener("keydown", onKey);
});
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <button type="button" class="hidden lg:inline-flex h-7 items-center border-2 px-2 font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer" :class="on ? 'border-yellow bg-yellow text-ink-text' : 'border-ink text-muted hover:text-cyan'" :aria-pressed="on" :title="t('paper.hint')" :aria-label="t('paper.hint')" @click="set(!on)">
    {{ t("paper.label") }}
  </button>
</template>
