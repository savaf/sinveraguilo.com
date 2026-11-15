<script setup lang="ts">
// Technology constellation: nodes are technologies (sized by project count), lines join
// technologies that appear together in at least one project. All data comes from content.
const props = defineProps<{
  projects: { technologies?: string[] }[];
  active: string[];
}>();
const emit = defineEmits<{ toggle: [tech: string] }>();

const SIZE = 560;
const C = SIZE / 2;
const R = 215;

const nodes = computed(() => {
  const counts = new Map<string, number>();
  props.projects.forEach((p) => new Set(p.technologies || []).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
  const list = Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return list.map(([name, n], i) => {
    const a = (i / list.length) * Math.PI * 2 - Math.PI / 2;
    return { name, n, x: C + R * Math.cos(a), y: C + R * Math.sin(a), r: 5 + n * 2.5, cos: Math.cos(a) };
  });
});
const edges = computed(() => {
  const w = new Map<string, number>();
  props.projects.forEach((p) => {
    const t = Array.from(new Set(p.technologies || [])).sort();
    for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) w.set(`${t[i]}|${t[j]}`, (w.get(`${t[i]}|${t[j]}`) || 0) + 1);
  });
  const by = new Map(nodes.value.map((n) => [n.name, n]));
  return Array.from(w.entries()).map(([k, n]) => {
    const [a, b] = k.split("|");
    return { a, b, n, A: by.get(a)!, B: by.get(b)! };
  });
});

const hover = ref<string | null>(null);
const focus = computed(() => hover.value ?? (props.active.length === 1 ? props.active[0] : null));
const linked = computed(() => {
  const s = new Set<string>();
  if (focus.value) edges.value.forEach((e) => (e.a === focus.value ? s.add(e.b) : e.b === focus.value && s.add(e.a)));
  return s;
});
const edgeOn = (e: { a: string; b: string }) => !focus.value || e.a === focus.value || e.b === focus.value;
const nodeOn = (n: string) => !focus.value || n === focus.value || linked.value.has(n);
</script>

<template>
  <section v-if="nodes.length > 2" class="border-b-2 border-ink bg-surface" :aria-label="$t('projects.constellation')">
    <div class="mx-auto grid max-w-[1180px] items-center gap-8 px-6 py-12 sm:px-10 lg:grid-cols-[1fr_minmax(0,520px)]">
      <div>
        <p class="m-0 font-mono text-xs font-bold uppercase tracking-[0.06em] text-cyan">{{ $t("projects.constellationKicker") }}</p>
        <h2 class="m-0 mt-2 font-display font-black uppercase text-slate-50 tracking-[-0.01em] text-[clamp(1.75rem,4vw,2.75rem)]">{{ $t("projects.constellation") }}</h2>
        <p class="mt-4 max-w-[46ch] text-slate-300">{{ $t("projects.constellationHint") }}</p>
        <p class="m-0 mt-4 font-mono text-xs text-dim" aria-live="polite">
          <template v-if="focus">{{ focus }} → {{ linked.size ? Array.from(linked).join(", ") : $t("projects.constellationAlone") }}</template>
          <template v-else>{{ nodes.length }} {{ $t("projects.constellationNodes") }} · {{ edges.length }} {{ $t("projects.constellationLinks") }}</template>
        </p>
      </div>
      <svg :viewBox="`0 0 ${SIZE} ${SIZE}`" class="h-auto w-full" role="group" :aria-label="$t('projects.constellation')">
        <line v-for="e in edges" :key="e.a + e.b" :x1="e.A.x" :y1="e.A.y" :x2="e.B.x" :y2="e.B.y" stroke="currentColor" class="text-cyan transition-opacity duration-200" :stroke-width="1 + e.n * 0.8" :opacity="edgeOn(e) ? (focus ? 0.9 : 0.3) : 0.04" />
        <g v-for="n in nodes" :key="n.name" role="button" tabindex="0" class="cursor-pointer outline-none" :aria-pressed="active.includes(n.name)" :aria-label="`${n.name} (${n.n})`" :opacity="nodeOn(n.name) ? 1 : 0.2" @mouseenter="hover = n.name" @mouseleave="hover = null" @focus="hover = n.name" @blur="hover = null" @click="emit('toggle', n.name)" @keydown.enter.prevent="emit('toggle', n.name)" @keydown.space.prevent="emit('toggle', n.name)">
          <circle :cx="n.x" :cy="n.y" :r="n.r" :class="active.includes(n.name) ? 'fill-yellow' : 'fill-cyan'" stroke="#0b0b1a" stroke-width="2" />
          <text :x="n.x + (n.cos >= 0 ? 1 : -1) * (n.r + 6)" :y="n.y + 4" :text-anchor="n.cos >= 0 ? 'start' : 'end'" class="fill-slate-50 font-mono" font-size="12">{{ n.name }}</text>
        </g>
      </svg>
    </div>
  </section>
</template>
