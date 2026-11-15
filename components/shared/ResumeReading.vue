<script setup lang="ts">
// Remembers how far you got in a post (localStorage, this browser only) and offers
// to jump back to that spot on your next visit.
const props = defineProps<{ id: string }>();
const { t } = useI18n();

const key = computed(() => `read-pos:${props.id}`);
const saved = ref(0);
const show = ref(false);
let raf = 0;

function ratio() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
}
function save() {
  raf = 0;
  const r = ratio();
  try {
    if (r > 0.97) localStorage.removeItem(key.value);
    else if (r > 0.05) localStorage.setItem(key.value, r.toFixed(3));
  } catch {}
}
function onScroll() {
  if (show.value && window.scrollY > 400) show.value = false;
  if (!show.value && !raf) raf = requestAnimationFrame(save);
}
function resume() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: saved.value * max, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  show.value = false;
}
function restart() {
  try {
    localStorage.removeItem(key.value);
  } catch {}
  show.value = false;
}

onMounted(() => {
  try {
    const v = parseFloat(localStorage.getItem(key.value) || "0");
    if (v > 0.05 && v < 0.97 && window.scrollY < 200) {
      saved.value = v;
      show.value = true;
    }
  } catch {}
  window.addEventListener("scroll", onScroll, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  if (raf) cancelAnimationFrame(raf);
});
</script>

<template>
  <transition name="fade">
    <div v-if="show" role="region" :aria-label="t('readingResume.label')" class="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-2rem)] border-2 border-ink bg-surface p-4 shadow-[6px_6px_0_var(--accent)]">
      <p class="m-0 font-mono text-[12px] uppercase text-cyan">{{ t("readingResume.title", { n: Math.round(saved * 100) }) }}</p>
      <div class="mt-3 flex gap-2">
        <button type="button" class="border-2 border-ink bg-yellow px-3 py-1.5 font-mono text-[12px] font-bold uppercase text-ink-text hover:bg-cyan" @click="resume">{{ t("readingResume.go") }} →</button>
        <button type="button" class="border-2 border-ink px-3 py-1.5 font-mono text-[12px] uppercase text-slate-50 hover:text-yellow" @click="restart">{{ t("readingResume.reset") }}</button>
      </div>
    </div>
  </transition>
</template>
