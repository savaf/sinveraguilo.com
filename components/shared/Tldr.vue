<script setup lang="ts">
const localePath = useLocalePath();
const open = ref(false);
const copied = ref(false);
const closeBtn = ref<HTMLButtonElement | null>(null);
const EMAIL = "hello@sinveraguilo.com";

const { data: jobExperiences } = await useAsyncData("tldr_experiences", () => queryContent("experiences").find());
const facts = computed(() => {
  const list = jobExperiences.value || [];
  const starts = list
    .map((e: any) => e.startDate)
    .filter(Boolean)
    .sort();
  const years = starts.length ? `${Math.floor(monthsBetween(starts[0]) / 12)}+` : "9+";
  return [
    { v: years, k: "stats.experience" },
    { v: `${list.length}+`, k: "stats.roles" },
  ];
});

async function show() {
  open.value = true;
  await nextTick();
  closeBtn.value?.focus();
}
function close() {
  open.value = false;
}
async function copy() {
  await navigator.clipboard?.writeText(EMAIL);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1800);
}
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape" && open.value) close();
}
const route = useRoute();
watch(() => route.path, close);
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <button type="button" class="inline-flex items-center border-2 border-yellow bg-yellow px-3 min-h-11 font-display text-xs font-extrabold uppercase text-ink-text cursor-pointer hover:bg-cyan" :aria-label="$t('tldr.aria')" @click="show">TL;DR</button>

  <Teleport to="body">
    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/80 px-4 py-8" role="dialog" aria-modal="true" :aria-label="$t('tldr.aria')" @mousedown.self="close">
        <div class="w-full max-w-xl border-2 border-ink bg-surface shadow-[8px_8px_0_var(--accent)]">
          <div class="flex items-center justify-between border-b-2 border-ink px-5 py-3">
            <span class="font-mono text-[13px] text-cyan">{{ $t("tldr.label") }}</span>
            <button ref="closeBtn" type="button" class="font-mono text-sm text-muted hover:text-white cursor-pointer" :aria-label="$t('palette.close')" @click="close">esc</button>
          </div>
          <div class="px-5 py-6">
            <p class="m-0 font-display text-sm font-extrabold uppercase text-yellow">{{ $t("hero.eyebrow") }} · {{ $t("hero.available") }}</p>
            <p class="m-0 mt-3 font-display text-2xl font-black uppercase leading-tight">{{ $t("hero.tagline") }}</p>
            <dl class="m-0 mt-5 grid grid-cols-2 gap-3">
              <div v-for="f in facts" :key="f.k" class="border-2 border-ink px-4 py-3">
                <dt class="font-mono text-[12px] text-dim">{{ $t(f.k) }}</dt>
                <dd class="m-0 font-display text-3xl font-black text-cyan">{{ f.v }}</dd>
              </div>
            </dl>
            <p class="m-0 mt-5 border-l-4 border-yellow pl-4 text-sm text-primary-light">{{ $t("impact.claim") }}</p>
            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <NuxtLink :to="localePath('/contact')" class="border-2 border-ink bg-cyan px-4 py-3 text-center font-display text-sm font-extrabold uppercase text-ink-text shadow-[4px_4px_0_#6366f1]">{{ $t("cta.button") }} →</NuxtLink>
              <a href="/Sinver-Aguilo-CV.pdf" download class="border-2 border-ink px-4 py-3 text-center font-display text-sm font-extrabold uppercase hover:text-cyan">{{ $t("hero.ctaCV") }}</a>
              <NuxtLink :to="localePath('/resume')" class="border-2 border-ink px-4 py-3 text-center font-display text-sm font-extrabold uppercase hover:text-cyan">{{ $t("palette.resume") }}</NuxtLink>
              <button type="button" class="border-2 border-ink px-4 py-3 font-display text-sm font-extrabold uppercase hover:text-cyan cursor-pointer" @click="copy">{{ copied ? $t("footer.copied") : $t("footer.copy") }}</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
