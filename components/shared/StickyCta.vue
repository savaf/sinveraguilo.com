<script setup lang="ts">
const localePath = useLocalePath();
const route = useRoute();
const scrolled = ref(false);
const dismissed = ref(false);

const onContact = computed(() => route.path.replace(/\/$/, "").endsWith("/contact"));
const visible = computed(() => scrolled.value && !dismissed.value && !onContact.value);

function onScroll() {
  scrolled.value = window.scrollY > 600;
}

function dismiss() {
  dismissed.value = true;
  try {
    sessionStorage.setItem("stickyCtaDismissed", "1");
  } catch {}
}

onMounted(() => {
  try {
    dismissed.value = sessionStorage.getItem("stickyCtaDismissed") === "1";
  } catch {}
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <transition name="fade">
    <div v-if="visible" class="fixed bottom-6 left-4 right-20 sm:right-auto sm:left-8 z-40 flex items-stretch border-2 border-ink bg-yellow text-ink-text shadow-[6px_6px_0_#22d3ee]">
      <NuxtLink :to="localePath('/contact')" class="flex items-center gap-3 px-4 py-3 font-display font-extrabold uppercase text-sm transition-colors hover:bg-cyan">
        <span class="relative flex h-2.5 w-2.5">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink-text opacity-60" />
          <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-ink-text" />
        </span>
        <span>{{ $t("sticky.text") }}</span>
        <span aria-hidden="true">→</span>
      </NuxtLink>
      <button type="button" :aria-label="$t('sticky.dismiss')" class="border-l-2 border-ink px-3 font-mono text-sm hover:bg-ink hover:text-yellow" @click="dismiss">×</button>
    </div>
  </transition>
</template>
