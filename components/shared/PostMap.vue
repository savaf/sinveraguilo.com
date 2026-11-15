<script setup lang="ts">
// Segmented "map" of a post: one block per H2 section, sized by its real word count.
// Click a block to jump; the block you are reading lights up.
const props = defineProps<{ body: any }>();
const { t } = useI18n();

type Seg = { id: string; text: string; words: number };

const segs = computed<Seg[]>(() => {
  const out: Seg[] = [];
  const count = (n: any): number => (n.type === "text" ? (n.value || "").trim().split(/\s+/).filter(Boolean).length : (n.children || []).reduce((a: number, c: any) => a + count(c), 0));
  let cur: Seg | null = null;
  for (const n of props.body?.children || []) {
    if (n.tag === "h2") {
      cur = { id: n.props?.id || "", text: (n.children || []).map((c: any) => c.value || "").join("") || "", words: 0 };
      if (cur.id && !/table of contents/i.test(cur.text)) out.push(cur);
      else cur = null;
    } else if (cur) cur.words += count(n);
  }
  return out.filter((s) => s.text);
});

const total = computed(() => segs.value.reduce((a, s) => a + s.words, 0) || 1);
const mins = (w: number) => Math.max(1, Math.round(w / 220));
const active = ref("");
let io: IntersectionObserver | null = null;

onMounted(() => {
  io = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        if (e.isIntersecting) active.value = e.target.id;
      });
    },
    { rootMargin: "-20% 0px -70% 0px" },
  );
  segs.value.forEach((s) => {
    const el = document.getElementById(s.id);
    if (el) io!.observe(el);
  });
});
onBeforeUnmount(() => io?.disconnect());

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}
</script>

<template>
  <nav v-if="segs.length > 1" :aria-label="t('postMap.label')" class="print:hidden mt-8">
    <p class="m-0 mb-2 font-mono text-[11px] uppercase tracking-wider text-dim">{{ t("postMap.label") }} · {{ t("postMap.hint") }}</p>
    <ol class="m-0 flex list-none gap-1 p-0">
      <li v-for="(s, i) in segs" :key="s.id" class="group relative min-w-[14px]" :style="{ flexGrow: s.words, flexBasis: 0 }">
        <button type="button" :aria-current="active === s.id ? 'true' : undefined" :aria-label="`${i + 1}. ${s.text} (${t('postMap.min', { n: mins(s.words) })})`" class="block h-8 w-full border-2 transition-colors" :class="active === s.id ? 'border-yellow bg-yellow' : 'border-ink bg-white/5 hover:border-yellow hover:bg-yellow/40'" @click="go(s.id)" />
        <span class="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-max max-w-[260px] border-2 border-ink bg-surface px-2.5 py-1.5 font-mono text-[11px] leading-snug text-slate-50 group-hover:block group-focus-within:block">
          <span class="text-yellow">{{ String(i + 1).padStart(2, "0") }}</span> {{ s.text }} · {{ t("postMap.min", { n: mins(s.words) }) }}
        </span>
      </li>
    </ol>
  </nav>
</template>
