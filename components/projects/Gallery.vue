<script setup lang="ts">
type Img = { id: number; title: string; img: string };
const props = defineProps<{ images: Img[] }>();
const shadows = ["#6366f1", "#22d3ee", "#facc15"];
const dialog = ref<HTMLDialogElement | null>(null);
const current = ref(0);
const total = computed(() => props.images.length);
const active = computed(() => props.images[current.value]);
let opener: HTMLElement | null = null;

function open(i: number, e?: Event) {
  opener = (e?.currentTarget as HTMLElement) || null;
  current.value = i;
  dialog.value?.showModal();
}
function step(d: number) {
  current.value = (current.value + d + total.value) % total.value;
}
function onKey(e: KeyboardEvent) {
  if (e.key === "ArrowRight") step(1);
  else if (e.key === "ArrowLeft") step(-1);
}
function onBackdrop(e: MouseEvent) {
  if (e.target === dialog.value) dialog.value?.close();
}
function onClose() {
  opener?.focus();
}
</script>

<template>
  <div>
    <div class="grid grid-cols-1 gap-6" :class="total > 1 ? 'sm:grid-cols-2' : ''">
      <button v-for="(img, i) in images" :key="img.id" v-reveal="(i % 2) * 90" type="button" class="group relative block cursor-zoom-in border-2 border-ink p-0 text-left" :class="i === 0 && total > 1 ? 'sm:col-span-2' : ''" :style="{ boxShadow: `${i === 0 ? 10 : 8}px ${i === 0 ? 10 : 8}px 0 ${shadows[i % shadows.length]}` }" :aria-label="`${$t('detail.zoom')}: ${img.title}`" @click="open(i, $event)">
        <NuxtImg :src="img.img" :alt="img.title" :width="i === 0 ? 1120 : 550" :height="i === 0 ? 600 : 360" class="block w-full" :class="i === 0 ? '' : 'h-full object-cover'" />
        <span class="absolute bottom-3 right-3 bg-ink px-2.5 py-1 font-mono text-[11px] uppercase text-yellow opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{{ $t("detail.zoom") }} ⤢</span>
      </button>
    </div>

    <dialog ref="dialog" class="m-auto h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/90" @keydown="onKey" @click="onBackdrop" @close="onClose">
      <div class="flex h-full flex-col items-center justify-center gap-4 p-4 sm:p-8" @click="onBackdrop($event as MouseEvent)">
        <img v-if="active" :src="active.img" :alt="active.title" class="max-h-[80dvh] max-w-full border-2 border-ink object-contain" />
        <div class="flex items-center gap-3 font-mono text-sm text-slate-200">
          <button type="button" class="border-2 border-ink bg-surface px-3 py-2 hover:bg-yellow hover:text-ink-text" :aria-label="$t('detail.prev')" @click="step(-1)">←</button>
          <span aria-live="polite">{{ current + 1 }} / {{ total }} · {{ active?.title }}</span>
          <button type="button" class="border-2 border-ink bg-surface px-3 py-2 hover:bg-yellow hover:text-ink-text" :aria-label="$t('detail.next')" @click="step(1)">→</button>
          <button type="button" autofocus class="ml-4 border-2 border-ink bg-yellow px-3 py-2 text-ink-text" @click="dialog?.close()">{{ $t("detail.close") }} ✕</button>
        </div>
      </div>
    </dialog>
  </div>
</template>
