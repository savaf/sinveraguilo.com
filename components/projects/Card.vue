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
    accent: undefined,
    categoryChip: "",
    subtitleClass: "text-muted",
    imgClass: "h-[180px]",
  },
);

const localePath = useLocalePath();
const href = computed(() => localePath(props.to ?? `/projects/${props.project.slug}`));
const displayImage = computed(() => props.project.image ?? props.fallback ?? undefined);

// @nuxt/image can't rasterize SVGs to webp — serve those as-is.
const isSvg = computed(() => displayImage.value?.endsWith(".svg") ?? false);

// 3D tilt + moving glare that follow the pointer (fine pointers, no reduced motion).
const tx = ref(0);
const ty = ref(0);
const gx = ref(50);
const gy = ref(50);
const tilting = ref(false);
function onMove(e: PointerEvent) {
  if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;
  tx.value = (0.5 - py) * 10;
  ty.value = (px - 0.5) * 10;
  gx.value = px * 100;
  gy.value = py * 100;
  tilting.value = true;
}
function onLeave() {
  tilting.value = false;
  tx.value = ty.value = 0;
}
const cardStyle = computed(() => ({
  ...(props.accent ? { "--accent": props.accent } : {}),
  "--rx": `${tx.value}deg`,
  "--ry": `${ty.value}deg`,
  "--gx": `${gx.value}%`,
  "--gy": `${gy.value}%`,
}));
</script>

<template>
  <NuxtLink :to="href" class="card relative block border-2 border-ink bg-surface" :class="{ 'is-tilting': tilting }" :style="cardStyle" :aria-label="project.title" @pointermove="onMove" @pointerleave="onLeave">
    <span class="card-glare" aria-hidden="true" />
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
    transform 0.15s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.card:hover {
  transform: perspective(900px) translate(-3px, -3px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  box-shadow: 10px 10px 0 var(--accent);
}
.card.is-tilting {
  transition:
    transform 0.08s linear,
    box-shadow 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.card-glare {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  background: radial-gradient(circle at var(--gx) var(--gy), rgb(255 255 255 / 0.16), transparent 55%);
}
.card.is-tilting .card-glare {
  opacity: 1;
}
.card:active {
  transform: translate(0, 0);
  box-shadow: 4px 4px 0 var(--accent);
}
</style>
