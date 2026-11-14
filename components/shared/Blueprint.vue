<script setup lang="ts">
const { t } = useI18n();
const KEY = "blueprint";
const on = ref(false);

const set = (v: boolean) => {
  on.value = v;
  document.documentElement.toggleAttribute("data-blueprint", v);
  try {
    localStorage.setItem(KEY, v ? "1" : "0");
  } catch {
    /* storage unavailable */
  }
};

function onKey(e: KeyboardEvent) {
  if (e.key.toLowerCase() !== "b" || e.metaKey || e.ctrlKey || e.altKey) return;
  const el = e.target as HTMLElement | null;
  if (el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))) return;
  set(!on.value);
}

onMounted(() => {
  try {
    if (localStorage.getItem(KEY) === "1") set(true);
  } catch {
    /* ignore */
  }
  window.addEventListener("keydown", onKey);
});
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <button type="button" class="hidden lg:inline-flex h-7 items-center border-2 px-2 font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer" :class="on ? 'border-yellow bg-yellow text-ink-text' : 'border-ink text-muted hover:text-cyan'" :aria-pressed="on" :title="t('blueprint.hint')" :aria-label="t('blueprint.hint')" @click="set(!on)">
    {{ t("blueprint.label") }}
  </button>
</template>
