<script setup lang="ts">
// Reads the article aloud with the browser's SpeechSynthesis, block by block,
// outlining the block being spoken. No audio files, no dependencies.
const props = defineProps<{ target: string }>();
const { t } = useI18n();

const supported = ref(false);
const state = ref<"idle" | "playing" | "paused">("idle");
const index = ref(0);
const total = ref(0);
let blocks: HTMLElement[] = [];
let run = 0;

onMounted(() => {
  supported.value = "speechSynthesis" in window;
});
onBeforeUnmount(stop);

function mark(i: number) {
  blocks.forEach((b, n) => (b.style.outline = n === i ? "2px solid var(--accent)" : ""));
  blocks.forEach((b, n) => (b.style.outlineOffset = n === i ? "6px" : ""));
}

function speak(i: number, id: number) {
  if (id !== run) return;
  if (i >= blocks.length) return stop();
  index.value = i;
  mark(i);
  blocks[i].scrollIntoView({ block: "center", behavior: "smooth" });
  const u = new SpeechSynthesisUtterance(blocks[i].innerText);
  u.lang = "en-US"; // posts are written in English
  u.onend = () => speak(i + 1, id);
  u.onerror = () => id === run && state.value === "playing" && stop();
  window.speechSynthesis.speak(u);
}

function start() {
  const root = document.querySelector(props.target);
  blocks = Array.from(root?.querySelectorAll<HTMLElement>("h2,h3,h4,p,li,blockquote") || []).filter((b) => b.innerText.trim().length > 1);
  if (!blocks.length) return;
  total.value = blocks.length;
  window.speechSynthesis.cancel();
  state.value = "playing";
  speak(0, ++run);
}

function toggle() {
  const s = window.speechSynthesis;
  if (state.value === "idle") start();
  else if (state.value === "playing") {
    s.pause();
    state.value = "paused";
  } else {
    s.resume();
    state.value = "playing";
  }
}

function stop() {
  run++;
  if (supported.value || "speechSynthesis" in window) window.speechSynthesis.cancel();
  mark(-1);
  state.value = "idle";
  index.value = 0;
}
</script>

<template>
  <div v-if="supported" class="mt-6 inline-flex max-w-full items-stretch border-2 border-ink bg-surface font-mono text-[12px] font-bold uppercase shadow-[4px_4px_0_var(--accent)]" role="group" :aria-label="t('listen.label')">
    <button type="button" class="flex items-center gap-2 bg-yellow px-4 py-2 text-ink-text hover:bg-cyan" :aria-pressed="state === 'playing'" @click="toggle">
      <span aria-hidden="true">{{ state === "playing" ? "❚❚" : "▶" }}</span>
      {{ state === "idle" ? t("listen.play") : state === "playing" ? t("listen.pause") : t("listen.resume") }}
    </button>
    <template v-if="state !== 'idle'">
      <span class="flex items-center px-3 text-dim" aria-live="off">{{ index + 1 }}/{{ total }}</span>
      <button type="button" class="border-l-2 border-ink px-3 py-2 text-slate-50 hover:bg-cyan hover:text-ink-text" @click="stop">{{ t("listen.stop") }}</button>
    </template>
  </div>
</template>
