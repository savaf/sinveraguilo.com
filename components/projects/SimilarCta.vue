<script setup lang="ts">
// Inline CTA at the end of a project page: start a similar project, with the
// contact form prefilled from this project.
const props = defineProps<{ title: string; technologies?: string[] }>();
const { t } = useI18n();
const localePath = useLocalePath();

const query = computed(() => ({
  subject: t("similar.subject", { title: props.title }).slice(0, 120),
  message: t("similar.message", { title: props.title, stack: (props.technologies || []).slice(0, 5).join(", ") }),
}));
</script>

<template>
  <aside class="mx-auto mb-14 max-w-[1180px] px-6 sm:px-10" :aria-label="t('similar.title')">
    <div class="flex flex-col gap-4 border-2 border-ink bg-surface p-6 shadow-[6px_6px_0_#22d3ee] sm:flex-row sm:items-center sm:justify-between">
      <p class="m-0 font-display text-lg font-extrabold uppercase leading-tight text-slate-50">{{ t("similar.title") }}</p>
      <NuxtLink :to="{ path: localePath('/contact'), query }" class="shrink-0 border-2 border-ink bg-yellow px-4 py-3 text-center font-display text-xs font-extrabold uppercase text-ink-text">{{ t("similar.cta") }} →</NuxtLink>
    </div>
  </aside>
</template>
