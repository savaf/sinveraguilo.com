<script setup lang="ts">
const localePath = useLocalePath();
const route = useRoute();
const pages = ["", "about", "projects", "blog", "colophon", "contact"] as const;
const key = "tourSeen";
const seen = ref<string[]>([]);

const current = () => {
  const seg = route.path.split("/").filter(Boolean);
  const rest = seg[0] === "es" || seg[0] === "en" ? seg.slice(1) : seg;
  return rest[0] ?? "";
};

onMounted(() => {
  try {
    const stored: string[] = JSON.parse(sessionStorage.getItem(key) || "[]");
    const set = new Set(stored.filter((s) => (pages as readonly string[]).includes(s)));
    set.add(current());
    seen.value = [...set];
    sessionStorage.setItem(key, JSON.stringify(seen.value));
  } catch {
    seen.value = [current()];
  }
});

const missing = computed(() => pages.filter((p) => !seen.value.includes(p)));
const label = (p: string) => (p === "" ? "home" : p);
</script>

<template>
  <div v-if="seen.length" class="relative mx-auto max-w-[1180px] px-6 pb-10 sm:px-10">
    <div class="border-2 border-ink bg-primary-dark p-4 shadow-[6px_6px_0_#0a1420]">
      <div class="flex flex-wrap items-center gap-3 font-mono text-xs font-bold uppercase text-yellow">
        <span>{{ $t("tour.kicker") }}</span>
        <span class="text-white">{{ $t("tour.title", { n: seen.length, total: pages.length }) }}</span>
      </div>
      <ul class="m-0 mt-3 flex list-none flex-wrap gap-2 p-0" role="list">
        <li v-for="p in pages" :key="p" class="border-2 border-ink px-3 py-1 font-mono text-xs font-bold uppercase" :class="seen.includes(p) ? 'bg-yellow text-ink-text' : 'bg-transparent text-indigo-50'">
          <span v-if="seen.includes(p)">✓ {{ $t(`nav.${label(p)}`) }}<span class="sr-only"> ({{ $t("tour.seen") }})</span></span>
          <NuxtLink v-else :to="localePath(`/${p}`)" class="underline underline-offset-4 hover:text-yellow">{{ $t(`nav.${label(p)}`) }}</NuxtLink>
        </li>
      </ul>
      <p v-if="!missing.length" class="m-0 mt-3 text-sm text-indigo-50">{{ $t("tour.done") }}</p>
    </div>
  </div>
</template>
