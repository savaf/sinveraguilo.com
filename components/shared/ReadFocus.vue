<script setup lang="ts">
// Focus reading: bigger type, narrower measure, and every block dims except the
// one nearest the middle of the screen. Pure CSS classes + one scroll handler.
const props = defineProps<{ target: string }>();
const { t } = useI18n();

const on = ref(false);
let blocks: HTMLElement[] = [];
let current: HTMLElement | null = null;
let raf = 0;

function pick() {
  raf = 0;
  const mid = window.innerHeight / 2;
  let best: HTMLElement | null = null;
  let bestD = Infinity;
  for (const b of blocks) {
    const r = b.getBoundingClientRect();
    const d = r.top <= mid && r.bottom >= mid ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
    if (d < bestD) {
      bestD = d;
      best = b;
    }
  }
  if (best === current) return;
  current?.removeAttribute("data-focus");
  best?.setAttribute("data-focus", "");
  current = best;
}
function schedule() {
  if (!raf) raf = requestAnimationFrame(pick);
}
function enable() {
  const root = document.querySelector(props.target);
  blocks = Array.from(root?.querySelectorAll<HTMLElement>("h2,h3,h4,p,li,blockquote,pre") || []);
  document.documentElement.classList.add("read-focus");
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  pick();
}
function disable() {
  document.documentElement.classList.remove("read-focus");
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  current?.removeAttribute("data-focus");
  current = null;
  blocks = [];
}
function toggle() {
  on.value = !on.value;
  on.value ? enable() : disable();
}
function onKey(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null;
  if (el && (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName))) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key.toLowerCase() === "f") toggle();
  else if (e.key === "Escape" && on.value) toggle();
}
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  disable();
});
</script>

<template>
  <button type="button" class="mt-6 ml-3 inline-flex items-center gap-2 border-2 border-ink bg-surface px-4 py-2 font-mono text-[12px] font-bold uppercase text-slate-50 shadow-[4px_4px_0_var(--accent)] hover:bg-cyan hover:text-ink-text" :aria-pressed="on" :title="t('focus.hint')" @click="toggle">
    <span aria-hidden="true">◎</span>
    {{ on ? t("focus.off") : t("focus.on") }}
    <kbd class="border border-current px-1 text-[10px]" aria-hidden="true">F</kbd>
  </button>
</template>

<style>
html.read-focus #post-body .prose {
  font-size: 1.25rem;
  line-height: 1.85;
  max-width: 38rem;
  margin-inline: auto;
}
html.read-focus #post-body .prose :is(h2, h3, h4, p, li, blockquote, pre) {
  opacity: 0.22;
  transition: opacity 0.25s;
}
html.read-focus #post-body .prose :is(h2, h3, h4, p, li, blockquote, pre)[data-focus] {
  opacity: 1;
}
html.read-focus header,
html.read-focus footer,
html.read-focus aside {
  opacity: 0.15;
  transition: opacity 0.25s;
}
html.read-focus header:hover,
html.read-focus footer:hover {
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  html.read-focus #post-body .prose * {
    transition: none !important;
  }
}
</style>
