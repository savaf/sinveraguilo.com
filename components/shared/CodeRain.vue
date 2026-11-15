<script setup lang="ts">
// Code rain mode: a canvas of falling code glyphs behind the page, tinted with
// the live accent color. Toggle with M. Off when the visitor prefers reduced motion.
const { t } = useI18n();
const on = ref(false);
const canvas = ref<HTMLCanvasElement | null>(null);
let raf = 0;
let stop: (() => void) | undefined;

function onKey(e: KeyboardEvent) {
  if (e.key.toLowerCase() !== "m" || e.metaKey || e.ctrlKey || e.altKey) return;
  const el = e.target as HTMLElement | null;
  if (el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))) return;
  on.value = !on.value;
}

function start(c: HTMLCanvasElement) {
  const ctx = c.getContext("2d");
  if (!ctx) return;
  const glyphs = "01{}[]()<>=;:/\\$#&*+-ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const size = 16;
  let drops: number[] = [];
  let last = 0;
  const resize = () => {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    drops = Array.from({ length: Math.ceil(c.width / size) }, () => Math.random() * -40);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, c.width, c.height);
  };
  resize();
  window.addEventListener("resize", resize);
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (now - last < 60) return;
    last = now;
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#22d3ee";
    ctx.fillStyle = "rgba(0,0,0,.12)";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = accent;
    ctx.font = `${size}px monospace`;
    drops.forEach((y, i) => {
      ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], i * size, y * size);
      drops[i] = y * size > c.height && Math.random() > 0.97 ? 0 : y + 1;
    });
  };
  raf = requestAnimationFrame(frame);
  stop = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}

watch(on, async (v) => {
  stop?.();
  stop = undefined;
  if (!v) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    on.value = false;
    return;
  }
  await nextTick();
  if (canvas.value) start(canvas.value);
});

onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  stop?.();
});
</script>

<template>
  <button type="button" class="hidden lg:inline-flex h-7 items-center border-2 px-2 font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer" :class="on ? 'border-yellow bg-yellow text-ink-text' : 'border-ink text-muted hover:text-cyan'" :aria-pressed="on" :title="t('rain.hint')" :aria-label="t('rain.hint')" @click="on = !on">
    {{ t("rain.label") }}
  </button>
  <Teleport to="body">
    <canvas v-if="on" ref="canvas" aria-hidden="true" class="pointer-events-none fixed inset-0 z-[55] opacity-30 mix-blend-screen" />
  </Teleport>
</template>
