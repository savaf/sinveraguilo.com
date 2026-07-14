<script setup>
const userScrollPosition = ref(0);
const isScrolled = computed(() => userScrollPosition.value > 100);

onMounted(() => {
  window.addEventListener("scroll", updateScrollPosition);
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
    <button v-show="isScrolled" title="Back To Top" class="transition duration-500 transform hover:scale-110 rounded-full cursor-pointer flex p-2 bg-indigo-500 hover:bg-indigo-600 text-white items-center hover:shadow-xs border-none ring-none outline-hidden" @click="backToTop">
      <Icon name="i-heroicons-arrow-up" class="w-6 h-6" />
    </button>
  </transition>
</template>
