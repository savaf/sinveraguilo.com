<script setup lang="ts">
// Facts come straight from the bio copy (about.bio1/bio2): nothing new is claimed here.
const root = ref<HTMLElement | null>(null);
const on = ref(true);
onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !root.value) return;
  on.value = false;
  const io = new IntersectionObserver(
    ([e]) => {
      if (e?.isIntersecting) {
        on.value = true;
        io.disconnect();
      }
    },
    { threshold: 0.35 },
  );
  io.observe(root.value);
  onBeforeUnmount(() => io.disconnect());
});
const proof = ["WCAG 2.1 AA", "i18n", "CI/CD · Docker · GitHub Actions"];
const migrated = ["Corotos", "NZXT", "Crunchyroll"];
</script>

<template>
  <section ref="root" class="relative border-b-2 border-ink overflow-hidden bg-yellow text-ink-text">
    <div class="mx-auto max-w-[1180px] grid grid-cols-1 md:grid-cols-[1fr_1.1fr]">
      <div class="px-6 py-14 sm:px-10 md:border-r-2 border-ink">
        <p class="m-0 font-mono text-xs font-bold uppercase tracking-[0.06em]">{{ $t("impact.kicker") }}</p>
        <div class="font-display font-black leading-[0.8] tracking-[-0.04em] text-[clamp(7rem,20vw,13rem)]" aria-hidden="true">≈4×</div>
        <p class="m-0 mt-4 font-grotesk text-xl font-semibold leading-snug max-w-[26ch]">{{ $t("impact.claim") }}</p>
        <span class="sr-only">≈4×</span>
      </div>
      <div class="px-6 py-14 sm:px-10 flex flex-col justify-center gap-8 bg-primary-dark text-slate-50">
        <div>
          <div class="flex justify-between font-mono text-xs uppercase mb-2">
            <span>{{ $t("impact.before") }}</span
            ><span>1×</span>
          </div>
          <div class="h-6 border-2 border-ink bg-surface"><div class="h-full bg-slate-400 origin-left transition-transform duration-[1200ms] ease-out" :class="on ? 'scale-x-[0.25]' : 'scale-x-0'" /></div>
        </div>
        <div>
          <div class="flex justify-between font-mono text-xs uppercase mb-2 text-cyan">
            <span>{{ $t("impact.after") }}</span
            ><span>≈4×</span>
          </div>
          <div class="h-6 border-2 border-ink bg-surface"><div class="h-full bg-cyan origin-left transition-transform duration-[1200ms] delay-300 ease-out" :class="on ? 'scale-x-100' : 'scale-x-0'" /></div>
        </div>
        <div class="font-mono text-xs text-muted leading-relaxed">
          <p class="m-0 mb-2 uppercase text-yellow">{{ $t("impact.migrated") }}</p>
          <div class="flex flex-wrap gap-2 mb-3">
            <span v-for="m in migrated" :key="m" class="border-2 border-ink bg-surface px-3 py-1 text-slate-200">{{ m }}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="p in proof" :key="p" class="border-2 border-ink px-3 py-1">{{ p }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
