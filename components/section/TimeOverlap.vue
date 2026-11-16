<script setup lang="ts">
const { t, locale } = useI18n();
const localePath = useLocalePath();

// Santo Domingo is fixed UTC-4 (no DST). Business hours are a generic 09-18 on both sides.
const MY_TZ = "America/Santo_Domingo";
const MY_OFFSET_MIN = -4 * 60;
const START = 9;
const END = 18;

const now = ref(new Date());
const visitorTz = ref("");
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  visitorTz.value = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  timer = setInterval(() => (now.value = new Date()), 30000);
});
onBeforeUnmount(() => clearInterval(timer));

const fmt = (tz?: string) => new Intl.DateTimeFormat(locale.value, { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(now.value);
const myTime = computed(() => fmt(MY_TZ));
const yourTime = computed(() => fmt());

// Visitor offset vs mine, in minutes (positive = visitor is ahead of me).
const diffMin = computed(() => -now.value.getTimezoneOffset() - MY_OFFSET_MIN);
const diffHours = computed(() => diffMin.value / 60);

const myHour = computed(() => Number(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: MY_TZ }).format(now.value)) % 24);

// 24 cells in MY clock: is it business hours for me, and for the visitor at that moment?
const cells = computed(() =>
  Array.from({ length: 24 }, (_, h) => {
    const theirs = ((((h * 60 + diffMin.value) / 60) % 24) + 24) % 24;
    const mine = h >= START && h < END;
    const yours = theirs >= START && theirs < END;
    return { h, both: mine && yours, mine, yours };
  }),
);
const overlap = computed(() => cells.value.filter((c) => c.both).length);

const offsetLabel = computed(() => {
  const d = diffHours.value;
  if (d === 0) return t("overlap.same");
  const abs = Math.abs(d);
  return t(d > 0 ? "overlap.ahead" : "overlap.behind", { n: Number.isInteger(abs) ? abs : abs.toFixed(1) });
});
</script>

<template>
  <section class="border-t-2 border-ink bg-surface">
    <div v-reveal class="mx-auto max-w-[1180px] px-6 py-14 sm:px-10">
      <ClientOnly>
        <div class="flex flex-wrap items-start justify-between gap-8">
          <div class="max-w-[46ch]">
            <p class="m-0 font-mono text-xs text-cyan uppercase">// {{ $t("overlap.kicker") }}</p>
            <h2 class="mt-2 mb-0 font-display font-black uppercase text-slate-50 tracking-[-0.01em] text-[clamp(1.75rem,4vw,2.5rem)]">
              {{ overlap > 0 ? $t("overlap.title", { n: overlap }) : $t("overlap.titleNone") }}
            </h2>
            <p class="mt-3 mb-0 text-sm text-muted">{{ $t("overlap.note", { start: START, end: END }) }}</p>
          </div>
          <div class="flex gap-px border-2 border-ink bg-ink font-mono">
            <div class="bg-primary-dark px-5 py-4">
              <span class="block text-[11px] text-dim uppercase">{{ $t("overlap.me") }}</span>
              <span class="block text-3xl font-bold text-yellow">{{ myTime }}</span>
            </div>
            <div class="bg-primary-dark px-5 py-4">
              <span class="block text-[11px] text-dim uppercase">{{ $t("overlap.you") }}</span>
              <span class="block text-3xl font-bold text-cyan">{{ yourTime }}</span>
            </div>
          </div>
        </div>

        <div class="mt-8" role="img" :aria-label="$t('overlap.aria', { n: overlap })">
          <div class="grid grid-cols-12 sm:grid-cols-24 gap-1" style="grid-template-columns: repeat(24, minmax(0, 1fr))">
            <div v-for="c in cells" :key="c.h" class="relative h-12 border-2 border-ink" :class="c.both ? 'bg-mint' : c.mine || c.yours ? 'bg-ternary-dark' : 'bg-primary-dark'" :title="`${String(c.h).padStart(2, '0')}:00`">
              <span v-if="c.h === myHour" class="absolute -top-2 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-yellow" />
            </div>
          </div>
          <div class="mt-2 flex justify-between font-mono text-[11px] text-dim"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>
          <div class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted">
            <span class="inline-flex items-center gap-2"><i class="h-3 w-3 bg-mint border border-ink" />{{ $t("overlap.legendBoth") }}</span>
            <span class="inline-flex items-center gap-2"><i class="h-3 w-3 bg-ternary-dark border border-ink" />{{ $t("overlap.legendOne") }}</span>
            <span class="inline-flex items-center gap-2"><i class="h-3 w-3 rotate-45 bg-yellow" />{{ $t("overlap.legendNow") }}</span>
            <span class="ml-auto text-dim">{{ visitorTz }} · {{ offsetLabel }}</span>
          </div>
        </div>

        <NuxtLink :to="localePath('/contact')" class="mt-8 inline-block font-display font-extrabold uppercase text-sm text-ink-text bg-yellow border-2 border-ink px-5 py-3 shadow-[4px_4px_0_var(--accent)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--accent)]"> {{ $t("overlap.cta") }} → </NuxtLink>
      </ClientOnly>
    </div>
  </section>
</template>
