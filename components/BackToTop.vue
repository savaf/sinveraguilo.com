<script setup>
const userScrollPosition = ref(0);
const isScrolled = computed(() => userScrollPosition.value > 100);

onMounted(() => {
  window.addEventListener("scroll", updateScrollPosition, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateScrollPosition);
});

function updateScrollPosition() {
  userScrollPosition.value = window.scrollY;
}

function backToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
</script>

<template>
  <!-- Scroll to top -->
  <transition name="fade">
    <button v-show="isScrolled" type="button" aria-label="Back to top" class="flex h-11 w-11 cursor-pointer items-center justify-center border-2 border-ink bg-yellow text-ink-text shadow-[4px_4px_0_#22d3ee] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#22d3ee] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_#22d3ee]" @click="backToTop">
      <Icon name="i-heroicons-arrow-up" class="h-5 w-5" aria-hidden="true" />
    </button>
  </transition>
</template>
