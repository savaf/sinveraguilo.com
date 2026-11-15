<script setup lang="ts">
// 404 mini-game: squash the bugs before they reach the bottom. Pure DOM + rAF, no deps.
const { t } = useI18n();
const W = 100; // arena is 100 x 100 logical units, bugs positioned in %
type Bug = { id: number; x: number; y: number; v: number; g: string };
const GLYPHS = ["🐛", "🪲", "🦟"];
const LIVES = 3;

const bugs = ref<Bug[]>([]);
const score = ref(0);
const lives = ref(LIVES);
const best = ref(0);
const state = ref<"idle" | "playing" | "over">("idle");
let raf = 0;
let last = 0;
let spawnIn = 0;
let nextId = 0;

onMounted(() => {
  best.value = Number(localStorage.getItem("bugsquash-best") || 0);
});
onBeforeUnmount(() => cancelAnimationFrame(raf));

function start() {
  bugs.value = [];
  score.value = 0;
  lives.value = LIVES;
  spawnIn = 0;
  last = performance.now();
  state.value = "playing";
  raf = requestAnimationFrame(tick);
}

function tick(now: number) {
  if (state.value !== "playing") return;
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  spawnIn -= dt;
  if (spawnIn <= 0) {
    bugs.value.push({ id: nextId++, x: 4 + Math.random() * 88, y: -8, v: 14 + Math.random() * 8 + score.value * 0.6, g: GLYPHS[Math.floor(Math.random() * GLYPHS.length)]! });
    spawnIn = Math.max(0.35, 1.1 - score.value * 0.03);
  }
  for (const b of bugs.value) b.y += b.v * dt;
  const escaped = bugs.value.filter((b) => b.y > W).length;
  if (escaped) {
    bugs.value = bugs.value.filter((b) => b.y <= W);
    lives.value = Math.max(0, lives.value - escaped);
    if (!lives.value) return end();
  }
  raf = requestAnimationFrame(tick);
}

function end() {
  state.value = "over";
  if (score.value > best.value) {
    best.value = score.value;
    localStorage.setItem("bugsquash-best", String(best.value));
  }
}

function squash(id: number) {
  if (state.value !== "playing") return;
  bugs.value = bugs.value.filter((b) => b.id !== id);
  score.value++;
}
</script>

<template>
  <section class="mt-12 max-w-[560px]" :aria-label="t('squash.title')">
    <div class="flex items-center justify-between gap-4 border-2 border-ink bg-ink-text/90 px-4 py-2 font-mono text-sm text-yellow shadow-[6px_6px_0_#0a1420]">
      <span class="font-display font-extrabold uppercase">{{ t("squash.title") }}</span>
      <span aria-live="polite">{{ t("squash.score", { n: score }) }} · {{ "♥".repeat(lives) || "–" }} · {{ t("squash.best", { n: best }) }}</span>
    </div>
    <div class="relative h-[260px] select-none overflow-hidden border-2 border-t-0 border-ink bg-ink-text/60 shadow-[6px_6px_0_#0a1420]">
      <button v-for="b in bugs" :key="b.id" type="button" class="absolute -translate-x-1/2 cursor-crosshair border-0 bg-transparent p-2 text-3xl leading-none" :style="{ left: b.x + '%', top: b.y + '%' }" :aria-label="t('squash.bug')" @pointerdown.prevent="squash(b.id)">{{ b.g }}</button>
      <div v-if="state !== 'playing'" class="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <p class="m-0 font-mono text-sm text-indigo-50">{{ state === "over" ? t("squash.over", { n: score }) : t("squash.intro") }}</p>
        <button type="button" class="border-2 border-ink bg-yellow px-5 py-3 font-display text-sm font-extrabold uppercase text-ink-text shadow-[4px_4px_0_#0a1420] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5" @click="start">{{ state === "over" ? t("squash.again") : t("squash.play") }}</button>
      </div>
    </div>
  </section>
</template>
