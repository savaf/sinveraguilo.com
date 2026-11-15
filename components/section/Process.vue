<script setup lang="ts">
const steps = [0, 1, 2, 3];
const faq = [0, 1, 2];
const list = ref<HTMLElement | null>(null);
const progress = ref(0); // 0..1 across the steps as the section scrolls through the viewport

const update = () => {
  const el = list.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  // 0 when the block's top hits 85% of the viewport, 1 when its bottom reaches 55%.
  const p = (vh * 0.85 - r.top) / (r.height + vh * 0.3);
  progress.value = Math.min(1, Math.max(0, p));
};
const reached = (i: number) => progress.value >= (i + 0.5) / steps.length - 0.12;

onMounted(() => {
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", update);
  window.removeEventListener("resize", update);
});
</script>

<template>
  <section class="border-t-2 border-ink bg-surface">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-10">
      <p class="m-0 font-mono text-xs font-bold uppercase tracking-[0.06em] text-cyan">{{ $t("process.kicker") }}</p>
      <h2 class="m-0 mt-2 font-display font-black uppercase text-primary-light tracking-[-0.01em] text-[clamp(2rem,4.5vw,3rem)] max-w-[20ch]">{{ $t("process.title") }}</h2>
      <div class="mt-10 flex items-center gap-3 font-mono text-xs font-bold text-yellow" aria-hidden="true">
        <span class="tabular-nums">{{ String(Math.min(steps.length, Math.max(1, Math.ceil(progress * steps.length)))).padStart(2, "0") }}/0{{ steps.length }}</span>
        <div class="h-1 flex-1 border-2 border-ink bg-surface"><div class="h-full bg-yellow" :style="{ width: `${progress * 100}%` }" /></div>
      </div>
      <ol ref="list" class="m-0 mt-4 p-0 list-none grid gap-0 border-2 border-ink sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="i in steps" :key="i" v-reveal class="group relative overflow-hidden p-6 border-ink border-b-2 last:border-b-0 sm:[&:nth-child(odd)]:border-r-2 lg:border-b-0 lg:border-r-2 lg:last:border-r-0 transition-colors hover:bg-indigo-600" :class="reached(i) ? 'bg-primary-dark' : 'bg-transparent'">
          <span class="block font-display font-black leading-[0.85] text-[clamp(4.5rem,9vw,6.5rem)] text-transparent [-webkit-text-stroke:2px_var(--accent)] group-hover:[-webkit-text-stroke-color:#fde047]" aria-hidden="true">0{{ i + 1 }}</span>
          <h3 class="m-0 mt-4 font-display font-extrabold uppercase text-xl text-primary-light">{{ $t(`process.steps[${i}].t`) }}</h3>
          <p class="m-0 mt-2 text-sm leading-relaxed text-muted group-hover:text-indigo-50">{{ $t(`process.steps[${i}].d`) }}</p>
        </li>
      </ol>
      <h3 class="m-0 mt-12 font-display font-black uppercase text-primary-light tracking-[-0.01em] text-2xl">{{ $t("faq.title") }}</h3>
      <div class="mt-6 border-2 border-ink">
        <details v-for="i in faq" :key="i" class="group border-ink bg-surface not-last:border-b-2 open:bg-indigo-600">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-lg font-extrabold uppercase text-primary-light marker:hidden [&::-webkit-details-marker]:hidden">
            {{ $t(`faq.items[${i}].q`) }}
            <span class="font-mono text-2xl text-yellow transition-transform group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <p class="m-0 px-5 pb-5 text-sm leading-relaxed text-indigo-50">{{ $t(`faq.items[${i}].a`) }}</p>
        </details>
      </div>
      <a href="#brief" class="mt-8 inline-block font-mono text-sm font-bold uppercase text-yellow underline underline-offset-4 hover:text-cyan">{{ $t("process.cta") }} ↓</a>
    </div>
  </section>
</template>
