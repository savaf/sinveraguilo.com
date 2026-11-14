<script setup lang="ts">
const { tm, rt } = useI18n();
const words = computed(() => rt(tm("manifesto.text") as never).split(" "));
const root = ref<HTMLElement | null>(null);
const progress = ref(1);

let raf = 0;
const update = () => {
  raf = 0;
  const el = root.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  // 0 when the block enters the lower third, 1 when it reaches the upper third
  progress.value = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.85 - r.height * 0.3 - vh * 0.15 + 1)));
};
const onScroll = () => {
  if (!raf) raf = requestAnimationFrame(update);
};

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  if (raf) cancelAnimationFrame(raf);
});
</script>

<template>
  <section class="border-t-2 border-ink bg-primary-dark">
    <div class="mx-auto max-w-[1180px] px-6 py-20 sm:px-10 sm:py-28">
      <p class="m-0 font-mono text-xs font-bold uppercase tracking-[0.06em] text-cyan">{{ $t("manifesto.kicker") }}</p>
      <p ref="root" class="m-0 mt-5 font-display font-black uppercase leading-[1.02] tracking-[-0.01em] text-[clamp(1.9rem,5vw,4rem)]">
        <span v-for="(w, i) in words" :key="i" class="transition-colors duration-200" :class="progress * words.length > i ? 'text-primary-light' : 'text-indigo-600'">{{ w }}{{ " " }}</span>
      </p>
    </div>
  </section>
</template>
