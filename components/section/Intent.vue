<script setup lang="ts">
const localePath = useLocalePath();
const active = ref(0);
const tabs = [
  {
    key: "hire",
    links: [
      { k: 0, to: "/resume" },
      { k: 1, to: "#career" },
    ],
  },
  {
    key: "project",
    links: [
      { k: 0, to: "#brief" },
      { k: 1, to: "#work" },
    ],
  },
  {
    key: "look",
    links: [
      { k: 0, to: "#work" },
      { k: 1, to: "#terminal" },
    ],
  },
];
const href = (to: string) => (to.startsWith("#") ? to : localePath(to));
function onKey(e: KeyboardEvent) {
  const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
  if (!d) return;
  e.preventDefault();
  active.value = (active.value + d + tabs.length) % tabs.length;
  nextTick(() => document.getElementById(`intent-tab-${active.value}`)?.focus());
}
</script>

<template>
  <section class="border-t-2 border-ink bg-primary-dark">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-10">
      <p class="m-0 font-mono text-xs font-bold uppercase tracking-[0.06em] text-cyan">{{ $t("intent.kicker") }}</p>
      <h2 class="m-0 mt-2 font-display font-black uppercase text-primary-light tracking-[-0.01em] text-[clamp(2rem,4.5vw,3rem)] max-w-[20ch]">{{ $t("intent.title") }}</h2>
      <div role="tablist" :aria-label="$t('intent.title')" class="mt-8 grid gap-0 border-2 border-ink sm:grid-cols-3" @keydown="onKey">
        <button v-for="(t, i) in tabs" :id="`intent-tab-${i}`" :key="t.key" role="tab" type="button" :aria-selected="active === i" :aria-controls="`intent-panel-${i}`" :tabindex="active === i ? 0 : -1" class="text-left p-5 font-display font-extrabold uppercase text-lg border-ink border-b-2 last:border-b-0 sm:border-b-0 sm:border-r-2 sm:last:border-r-0 transition-colors" :class="active === i ? 'bg-yellow text-ink-text' : 'bg-surface text-primary-light hover:bg-indigo-600'" @click="active = i">
          <span class="block font-mono text-xs font-bold tracking-[0.06em]" aria-hidden="true">0{{ i + 1 }}</span>
          {{ $t(`intent.${t.key}.tab`) }}
        </button>
      </div>
      <div v-for="(t, i) in tabs" v-show="active === i" :id="`intent-panel-${i}`" :key="t.key" role="tabpanel" :aria-labelledby="`intent-tab-${i}`" class="border-2 border-t-0 border-ink bg-surface p-6 sm:p-8">
        <p class="m-0 text-lg leading-relaxed text-primary-light max-w-[60ch]">{{ $t(`intent.${t.key}.pitch`) }}</p>
        <div class="mt-6 flex flex-wrap gap-4">
          <a v-for="l in t.links" :key="l.k" :href="href(l.to)" class="font-display font-extrabold uppercase text-sm text-ink-text bg-yellow border-2 border-ink px-5 py-3 shadow-[4px_4px_0_#0a1420] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0a1420]">{{ $t(`intent.${t.key}.links[${l.k}]`) }} →</a>
        </div>
      </div>
    </div>
  </section>
</template>
