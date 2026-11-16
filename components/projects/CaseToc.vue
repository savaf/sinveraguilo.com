<script setup lang="ts">
type Link = { id: string; text: string; children?: Link[] };
const props = defineProps<{ links: Link[] }>();

// Flatten h2 + h3 (skip the markdown's own "Table of Contents" heading)
const items = computed(() => {
  const out: { id: string; text: string; depth: number }[] = [];
  const walk = (ls: Link[], depth: number) =>
    ls.forEach((l) => {
      if (!/table of contents/i.test(l.text)) out.push({ id: l.id, text: l.text, depth });
      if (l.children && depth < 2) walk(l.children, depth + 1);
    });
  walk(props.links || [], 1);
  return out;
});

const active = ref("");
const progress = ref(0);
let io: IntersectionObserver | null = null;

function onScroll() {
  const el = document.documentElement;
  const max = el.scrollHeight - window.innerHeight;
  progress.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  io = new IntersectionObserver(
    (entries) => {
      const hit = entries.find((e) => e.isIntersecting);
      if (hit) active.value = hit.target.id;
    },
    { rootMargin: "-80px 0px -70% 0px" },
  );
  items.value.forEach((i) => {
    const node = document.getElementById(i.id);
    if (node) io!.observe(node);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  io?.disconnect();
});
</script>

<template>
  <nav v-if="items.length > 2" :aria-label="$t('detail.toc')" class="hidden lg:block mb-10 border-2 border-ink bg-surface p-5">
    <div class="flex items-center justify-between mb-3">
      <h3 class="m-0 font-mono text-[13px] text-cyan uppercase tracking-[0.06em]">{{ $t("detail.toc") }}</h3>
      <span class="font-mono text-xs text-yellow tabular-nums">{{ Math.round(progress * 100) }}%</span>
    </div>
    <div class="h-1 bg-ink mb-4"><div class="h-full bg-yellow origin-left" :style="{ width: `${progress * 100}%` }" /></div>
    <ul class="m-0 p-0 list-none max-h-[50vh] overflow-y-auto">
      <li v-for="item in items" :key="item.id">
        <a :href="`#${item.id}`" class="block py-1 font-mono text-xs border-l-2 transition-colors hover:text-cyan" :class="[item.depth > 1 ? 'pl-6' : 'pl-3', active === item.id ? 'border-yellow text-yellow' : 'border-ink text-muted']">{{ item.text }}</a>
      </li>
    </ul>
  </nav>
</template>
