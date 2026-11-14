<script setup lang="ts">
// Select text inside the slotted article to get a floating copy / share popover.
const { t } = useI18n();
const root = ref<HTMLElement | null>(null);
const text = ref("");
const pos = reactive({ x: 0, y: 0 });
const copied = ref(false);
let timer: ReturnType<typeof setTimeout>;

function update() {
  const sel = window.getSelection();
  const str = sel?.toString().trim() || "";
  if (!sel || sel.rangeCount === 0 || str.length < 12 || !root.value?.contains(sel.anchorNode) || !root.value?.contains(sel.focusNode)) {
    text.value = "";
    return;
  }
  const r = sel.getRangeAt(0).getBoundingClientRect();
  text.value = str.slice(0, 240);
  pos.x = Math.min(Math.max(r.left + r.width / 2, 130), window.innerWidth - 130);
  pos.y = Math.max(r.top - 8, 56);
  copied.value = false;
}
function onSelect() {
  clearTimeout(timer);
  timer = setTimeout(update, 60);
}
onMounted(() => document.addEventListener("selectionchange", onSelect));
onBeforeUnmount(() => {
  document.removeEventListener("selectionchange", onSelect);
  clearTimeout(timer);
});

const quote = computed(() => `“${text.value}” — ${window.location.href}`);
const enc = (s: string) => encodeURIComponent(s);
const xUrl = computed(() => (text.value ? `https://twitter.com/intent/tweet?text=${enc(`“${text.value}”`)}&url=${enc(window.location.href)}` : "#"));
const liUrl = computed(() => (text.value ? `https://www.linkedin.com/sharing/share-offsite/?url=${enc(window.location.href)}` : "#"));

async function copy() {
  try {
    await navigator.clipboard.writeText(quote.value);
    copied.value = true;
  } catch {
    /* clipboard unavailable */
  }
}
</script>

<template>
  <div ref="root">
    <slot />
    <Teleport to="body">
      <div v-if="text" role="toolbar" :aria-label="t('quote.label')" class="fixed z-[60] flex -translate-x-1/2 -translate-y-full items-stretch border-2 border-ink bg-yellow font-mono text-[12px] font-bold uppercase text-ink-text shadow-[4px_4px_0_var(--accent)]" :style="{ left: `${pos.x}px`, top: `${pos.y}px` }" @mousedown.prevent>
        <button type="button" class="px-3 py-2 hover:bg-cyan" @click="copy">{{ copied ? t("quote.copied") : t("quote.copy") }}</button>
        <a :href="xUrl" target="_blank" rel="noopener noreferrer" class="border-l-2 border-ink px-3 py-2 hover:bg-cyan">X</a>
        <a :href="liUrl" target="_blank" rel="noopener noreferrer" class="border-l-2 border-ink px-3 py-2 hover:bg-cyan">LinkedIn</a>
      </div>
    </Teleport>
  </div>
</template>
