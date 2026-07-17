<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    project: {
      title: string;
      slug: string;
      image?: string;
    };
    subtitle: string;
    to?: string;
    // Shown when the project has no image; pass null to render no image at all.
    fallback?: string | null;
    accent?: string;
    categoryChip?: string;
    subtitleClass?: string;
    imgClass?: string;
  }>(),
  {
    to: undefined,
    fallback: "/images/projects/placeholder.svg",
    accent: "#22d3ee",
    categoryChip: "",
    subtitleClass: "text-muted",
    imgClass: "h-[180px]",
  },
);

const href = computed(() => props.to ?? `/projects/${props.project.slug}`);
const displayImage = computed(() => props.project.image ?? props.fallback ?? undefined);

// @nuxt/image can't rasterize SVGs to webp — serve those as-is.
const isSvg = computed(() => displayImage.value?.endsWith(".svg") ?? false);
</script>

<template>
  <NuxtLink :to="href" class="card block border-2 border-ink bg-surface" :style="{ '--accent': accent }" :aria-label="project.title">
    <NuxtImg v-if="displayImage" :src="displayImage" :alt="project.title" width="380" height="190" :format="isSvg ? undefined : 'webp'" loading="lazy" class="w-full object-cover block border-b-2 border-ink" :class="imgClass" />
    <div class="p-5">
      <span v-if="categoryChip" class="inline-block font-mono text-[11px] text-ink-text bg-yellow px-2 py-[3px] mb-2.5">{{ categoryChip }}</span>
      <div class="font-display font-extrabold text-primary-light text-[18px] uppercase leading-tight">{{ project.title }}</div>
      <div class="font-mono text-xs mt-1.5" :class="subtitleClass">{{ subtitle }}</div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.card {
  box-shadow: 6px 6px 0 var(--accent);
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}
.card:hover {
  transform: translate(-3px, -3px);
  box-shadow: 10px 10px 0 var(--accent);
}
</style>
