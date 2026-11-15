<script setup lang="ts">
type Row = { key: string; value: string; good: boolean | null };

const rows = ref<Row[]>([]);
const ready = ref(false);
const fcp = ref<number | null>(null);
const lcp = ref<number | null>(null);
const cls = ref(0);
const observers: PerformanceObserver[] = [];

const ms = (n: number) => `${Math.round(n)} ms`;

function observe(type: string, cb: (entries: PerformanceEntryList) => void) {
  try {
    const po = new PerformanceObserver((l) => cb(l.getEntries()));
    po.observe({ type, buffered: true });
    observers.push(po);
  } catch {
    /* entry type unsupported in this browser */
  }
}

function build() {
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  const bytes = (nav?.transferSize || 0) + res.reduce((s, r) => s + (r.transferSize || 0), 0);
  const list: Row[] = [];
  if (nav) list.push({ key: "ttfb", value: ms(nav.responseStart), good: nav.responseStart < 800 });
  if (fcp.value !== null) list.push({ key: "fcp", value: ms(fcp.value), good: fcp.value < 1800 });
  if (lcp.value !== null) list.push({ key: "lcp", value: ms(lcp.value), good: lcp.value < 2500 });
  list.push({ key: "cls", value: cls.value.toFixed(3), good: cls.value < 0.1 });
  if (bytes > 0) list.push({ key: "bytes", value: `${(bytes / 1024).toFixed(0)} KB`, good: null });
  list.push({ key: "dom", value: String(document.getElementsByTagName("*").length), good: null });
  rows.value = list;
  ready.value = true;
}

onMounted(() => {
  observe("paint", (es) => {
    const e = es.find((x) => x.name === "first-contentful-paint");
    if (e) fcp.value = e.startTime;
  });
  observe("largest-contentful-paint", (es) => {
    const last = es[es.length - 1];
    if (last) lcp.value = last.startTime;
  });
  observe("layout-shift", (es) => {
    for (const e of es as any[]) if (!e.hadRecentInput) cls.value += e.value;
  });
  setTimeout(build, 600);
});
onBeforeUnmount(() => observers.forEach((o) => o.disconnect()));
</script>

<template>
  <section class="border-t-2 border-ink bg-surface">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-10">
      <p class="m-0 font-mono text-xs font-bold uppercase tracking-[0.06em] text-cyan">{{ $t("perf.kicker") }}</p>
      <h2 class="m-0 mt-2 font-display font-black uppercase text-primary-light tracking-[-0.01em] text-[clamp(2rem,4.5vw,3rem)] max-w-[20ch]">{{ $t("perf.title") }}</h2>
      <p class="m-0 mt-4 max-w-[60ch] text-muted">{{ $t("perf.lead") }}</p>
      <div class="mt-8 border-2 border-ink bg-primary-dark p-5 sm:p-8 font-mono text-sm max-w-[640px]" role="region" :aria-label="$t('perf.title')">
        <p v-if="!ready" class="m-0 text-muted" aria-live="polite">{{ $t("perf.measuring") }}</p>
        <dl v-else class="m-0 grid grid-cols-[minmax(0,1fr)] gap-0">
          <div v-for="r in rows" :key="r.key" class="flex items-baseline gap-3 border-b border-dashed border-indigo-600 py-2 last:border-b-0">
            <dt class="m-0 text-primary-light">
              <abbr :title="$t(`perf.rows.${r.key}.d`)" class="no-underline">{{ $t(`perf.rows.${r.key}.t`) }}</abbr>
            </dt>
            <span class="flex-1 overflow-hidden whitespace-nowrap text-indigo-600" aria-hidden="true">{{ ".".repeat(60) }}</span>
            <dd class="m-0 font-bold" :class="r.good === null ? 'text-primary-light' : r.good ? 'text-cyan' : 'text-yellow'">
              {{ r.value }}<span v-if="r.good !== null" class="sr-only"> ({{ r.good ? $t("perf.good") : $t("perf.slow") }})</span>
              <span v-if="r.good !== null" aria-hidden="true"> {{ r.good ? "✓" : "!" }}</span>
            </dd>
          </div>
        </dl>
      </div>
      <p class="m-0 mt-4 max-w-[60ch] text-xs text-muted">{{ $t("perf.note") }}</p>
    </div>
  </section>
</template>
