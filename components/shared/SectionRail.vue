<script setup lang="ts">
// Fixed index rail for the home page: scrollspy via IntersectionObserver, plus a
// fill that tracks how far through the page you are.
const { t } = useI18n();
const items = [
  { id: "work", key: "rail.work" },
  { id: "career", key: "rail.career" },
  { id: "stack", key: "rail.stack" },
  { id: "terminal", key: "rail.terminal" },
  { id: "brief", key: "rail.brief" },
];
const current = ref("");
const progress = ref(0);
let io: IntersectionObserver | undefined;

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
}

function go(id: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

onMounted(() => {
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) current.value = e.target.id;
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  items.forEach((i) => {
    const el = document.getElementById(i.id);
    if (el) io!.observe(el);
  });
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
onBeforeUnmount(() => {
  io?.disconnect();
  window.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <nav :aria-label="t('rail.label')" class="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 2xl:block">
    <div class="relative flex flex-col gap-1 border-l-2 border-ink pl-4">
      <span class="absolute -left-0.5 top-0 w-0.5 origin-top bg-yellow" :style="{ height: progress * 100 + '%' }" aria-hidden="true" />
      <button v-for="(item, i) in items" :key="item.id" type="button" class="group flex items-center gap-2 py-1.5 text-left font-mono text-[11px] uppercase tracking-[0.08em] transition-colors" :class="current === item.id ? 'text-yellow' : 'text-primary-light/50 hover:text-cyan'" :aria-current="current === item.id ? 'true' : undefined" @click="go(item.id)">
        <span>0{{ i + 1 }}</span>
        <span class="overflow-hidden whitespace-nowrap transition-all duration-200" :class="current === item.id ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 group-focus-visible:max-w-[120px] group-focus-visible:opacity-100'">{{ t(item.key) }}</span>
      </button>
    </div>
  </nav>
</template>
