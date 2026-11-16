<script setup lang="ts">
// Previous / next project pager. Wraps around the list; links are keyboard-focusable.
const props = defineProps<{ slug: string; projects: any[] }>();
const localePath = useLocalePath();

const pair = computed(() => {
  const list = props.projects || [];
  const i = list.findIndex((p) => p.slug === props.slug);
  if (i < 0 || list.length < 2) return null;
  return { prev: list[(i - 1 + list.length) % list.length], next: list[(i + 1) % list.length] };
});
</script>

<template>
  <nav v-if="pair" class="mx-auto max-w-[1180px] px-6 pb-14 sm:px-10" :aria-label="$t('detail.more')">
    <div class="grid grid-cols-1 sm:grid-cols-2 border-2 border-ink">
      <NuxtLink :to="localePath(`/projects/${pair.prev.slug}`)" rel="prev" class="group block bg-surface p-6 sm:p-8 transition-colors hover:bg-yellow sm:border-r-2 border-b-2 sm:border-b-0 border-ink">
        <span class="font-mono text-[13px] uppercase tracking-[0.06em] text-cyan group-hover:text-ink-text">← {{ $t("detail.prevProject") }}</span>
        <span class="mt-2 block font-display font-black uppercase leading-[0.95] text-slate-50 text-[clamp(1.4rem,3vw,2rem)] group-hover:text-ink-text">{{ pair.prev.title }}</span>
      </NuxtLink>
      <NuxtLink :to="localePath(`/projects/${pair.next.slug}`)" rel="next" class="group block bg-surface p-6 sm:p-8 text-left sm:text-right transition-colors hover:bg-yellow">
        <span class="font-mono text-[13px] uppercase tracking-[0.06em] text-cyan group-hover:text-ink-text">{{ $t("detail.nextProject") }} →</span>
        <span class="mt-2 block font-display font-black uppercase leading-[0.95] text-slate-50 text-[clamp(1.4rem,3vw,2rem)] group-hover:text-ink-text">{{ pair.next.title }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
