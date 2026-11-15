<script setup lang="ts">
// Headless: toggled with the B key or the "blueprint:toggle" window event (command palette).
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

const onToggle = () => set(!on.value);

onMounted(() => {
  try {
    if (localStorage.getItem(KEY) === "1") set(true);
  } catch {
    /* ignore */
  }
  window.addEventListener("keydown", onKey);
  window.addEventListener("blueprint:toggle", onToggle);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  window.removeEventListener("blueprint:toggle", onToggle);
});
</script>

<template>
  <span class="hidden" />
</template>
