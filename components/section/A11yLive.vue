<script setup lang="ts">
const modes = ["text", "contrast", "motion", "spacing"] as const;
type Mode = (typeof modes)[number];
const KEY = "a11y-live";
const active = ref<Mode[]>([]);

const apply = () => {
  const cl = document.documentElement.classList;
  modes.forEach((m) => cl.toggle(`a11y-${m}`, active.value.includes(m)));
};
const toggle = (m: Mode) => {
  active.value = active.value.includes(m) ? active.value.filter((x) => x !== m) : [...active.value, m];
  apply();
  localStorage.setItem(KEY, JSON.stringify(active.value));
};
const reset = () => {
  active.value = [];
  apply();
  localStorage.removeItem(KEY);
};

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "[]") as Mode[];
    active.value = saved.filter((m) => modes.includes(m));
    apply();
  } catch {
    /* ignore corrupt storage */
  }
});
</script>

<template>
  <section class="border-t-2 border-ink bg-primary-dark">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-10">
      <p class="m-0 font-mono text-xs font-bold uppercase tracking-[0.06em] text-cyan">{{ $t("a11y.kicker") }}</p>
      <h2 class="m-0 mt-2 font-display font-black uppercase text-primary-light tracking-[-0.01em] text-[clamp(2rem,4.5vw,3rem)] max-w-[20ch]">{{ $t("a11y.title") }}</h2>
      <p class="m-0 mt-4 max-w-[60ch] text-muted">{{ $t("a11y.lead") }}</p>
      <ul class="m-0 mt-8 p-0 list-none grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="m in modes" :key="m">
          <button type="button" :aria-pressed="active.includes(m)" class="w-full h-full text-left border-2 border-ink p-5 transition-colors cursor-pointer" :class="active.includes(m) ? 'bg-yellow text-ink' : 'bg-surface text-primary-light hover:bg-indigo-600'" @click="toggle(m)">
            <span class="block font-mono text-xs font-bold uppercase">{{ active.includes(m) ? $t("a11y.on") : $t("a11y.off") }}</span>
            <span class="block mt-2 font-display font-extrabold uppercase text-lg">{{ $t(`a11y.modes.${m}.t`) }}</span>
            <span class="block mt-1 text-sm">{{ $t(`a11y.modes.${m}.d`) }}</span>
          </button>
        </li>
      </ul>
      <button v-if="active.length" type="button" class="mt-6 font-mono text-sm font-bold uppercase text-yellow underline underline-offset-4 hover:text-cyan cursor-pointer" @click="reset">{{ $t("a11y.reset") }}</button>
    </div>
  </section>
</template>
