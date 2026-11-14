<script setup lang="ts">
const techs = ["Vue", "React", "Node", "TypeScript", "Angular"];
const localePath = useLocalePath();

// Name "decode" on load: glyphs resolve left to right. SSR and reduced-motion
// users get the final text straight away.
const FIRST = "Sinver";
const LAST = "Aguiló";
const first = ref(FIRST);
const last = ref(LAST);
onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const pool = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&";
  const full = FIRST + LAST;
  const start = performance.now();
  const step = 70; // ms between each letter locking in
  const tick = (now: number) => {
    const locked = Math.floor((now - start - 150) / step);
    const out = [...full].map((c, i) => (i < locked ? c : pool[Math.floor(Math.random() * pool.length)]!)).join("");
    first.value = out.slice(0, FIRST.length);
    last.value = out.slice(FIRST.length);
    if (locked < full.length) requestAnimationFrame(tick);
    else {
      first.value = FIRST;
      last.value = LAST;
    }
  };
  requestAnimationFrame(tick);
});

// Colour "flashlight" over the grayscale portrait, following the pointer.
const lit = ref(false);
const x = ref(0);
const y = ref(0);
function move(e: PointerEvent) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  x.value = e.clientX - r.left;
  y.value = e.clientY - r.top;
  lit.value = true;
}

// Cyan grid that lights up under the pointer across the whole hero (fine pointers only).
const gx = ref(-999);
const gy = ref(-999);
function moveGrid(e: PointerEvent) {
  if (e.pointerType === "touch") return;
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  gx.value = e.clientX - r.left;
  gy.value = e.clientY - r.top;
}
function leaveGrid() {
  gx.value = gy.value = -999;
}
</script>

<style scoped>
.portrait-color {
  opacity: 0;
  transition: opacity 0.3s ease;
  -webkit-mask-image: radial-gradient(circle 130px at var(--x) var(--y), #000 55%, transparent 100%);
  mask-image: radial-gradient(circle 130px at var(--x) var(--y), #000 55%, transparent 100%);
}
.grid-glow {
  background-image: linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px);
  background-size: 44px 44px;
  pointer-events: none;
  -webkit-mask-image: radial-gradient(circle 220px at var(--gx) var(--gy), #000 0%, transparent 100%);
  mask-image: radial-gradient(circle 220px at var(--gx) var(--gy), #000 0%, transparent 100%);
}
@media (prefers-reduced-motion: reduce) {
  .grid-glow {
    display: none;
  }
}
.is-lit .portrait-color {
  opacity: 1;
}
</style>

<template>
  <section class="relative border-b-2 border-ink overflow-hidden" @pointermove="moveGrid" @pointerleave="leaveGrid">
    <div class="absolute inset-0 grid-overlay" />
    <div class="absolute inset-0 grid-glow" aria-hidden="true" :style="{ '--gx': gx + 'px', '--gy': gy + 'px' }" />
    <div class="relative mx-auto max-w-[1180px] grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr]">
      <!-- Left -->
      <div class="px-6 py-14 sm:px-10 sm:py-16 md:border-r-2 border-ink">
        <div class="hero-enter inline-flex items-center gap-2 font-mono text-xs font-medium text-ink-text bg-mint border-2 border-ink px-3 py-1.5 mb-6" style="--i: 0">
          <span class="w-2 h-2 rounded-full bg-ink-text" />
          {{ $t("hero.available") }}
        </div>

        <h1 class="hero-enter m-0 font-display font-black uppercase text-slate-50 leading-[0.9] tracking-[-0.02em] text-[clamp(3.25rem,7vw,5.25rem)]" style="--i: 1" aria-label="Sinver Aguiló">
          <span aria-hidden="true" class="whitespace-nowrap">{{ first }}</span><br aria-hidden="true" /><span aria-hidden="true" class="text-cyan whitespace-nowrap">{{ last }}</span>
        </h1>

        <p class="hero-enter mt-5 font-mono text-[15px] leading-relaxed text-yellow max-w-[40ch]" style="--i: 2"><span class="text-dim">const role = </span>"{{ $t("hero.eyebrow") }}"</p>

        <p class="hero-enter mt-4 font-grotesk text-[22px] font-medium leading-snug text-slate-200 max-w-[28ch]" style="--i: 3">
          {{ $t("hero.tagline") }}
        </p>

        <!-- Split CTA -->
        <div class="hero-enter mt-9" style="--i: 4">
          <div class="group inline-flex w-max border-2 border-ink shadow-[6px_6px_0_#22d3ee] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#22d3ee] active:translate-x-0 active:translate-y-0 active:shadow-[4px_4px_0_#22d3ee]">
            <NuxtLink :to="localePath('/projects')" class="font-display font-extrabold uppercase text-[15px] bg-indigo-600 text-white px-[26px] py-[15px] border-r-2 border-ink">
              {{ $t("hero.ctaWork") }}
            </NuxtLink>
            <a href="/Sinver-Aguilo-CV.pdf" download class="font-display font-extrabold uppercase text-[15px] bg-primary-dark text-primary-light px-[26px] py-[15px]">
              {{ $t("hero.ctaCV") }}
            </a>
          </div>
          <NuxtLink :to="localePath('/resume')" class="mt-4 block font-mono text-xs text-cyan underline underline-offset-4 hover:text-yellow">{{ $t("palette.resume") }} →</NuxtLink>
        </div>

        <!-- Tech tags -->
        <div class="hero-enter flex flex-wrap gap-2 mt-8 font-mono text-xs font-medium" style="--i: 5">
          <span v-for="(tech, i) in techs" :key="tech" class="border-2 border-ink px-3 py-[5px]" :class="i === 0 ? 'text-ink-text bg-yellow' : 'text-slate-200 bg-surface'">
            {{ tech }}
          </span>
        </div>
      </div>

      <!-- Right -->
      <div class="hero-enter portrait relative flex items-stretch bg-surface min-h-[420px] overflow-hidden touch-pan-y" :class="{ 'is-lit': lit }" style="--i: 2" @pointermove="move" @pointerleave="lit = false">
        <NuxtImg src="/images/portrait.jpg" alt="Sinver Aguiló" width="575" height="522" class="w-full object-cover grayscale contrast-[1.05]" />
        <NuxtImg src="/images/portrait.jpg" alt="" aria-hidden="true" width="575" height="522" class="portrait-color absolute inset-0 w-full h-full object-cover pointer-events-none" :style="{ '--x': x + 'px', '--y': y + 'px' }" />
        <div class="absolute left-0 bottom-0 font-mono font-bold text-xs text-ink-text bg-cyan px-3.5 py-2 border-t-2 border-r-2 border-ink">
          {{ $t("hero.label") }}
        </div>
      </div>
    </div>
  </section>
</template>
