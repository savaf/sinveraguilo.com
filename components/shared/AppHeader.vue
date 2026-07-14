<script setup lang="ts">
const route = useRoute();
const mobileMenuOpen = ref(false);

const nav = [
  { key: "nav.home", to: "/" },
  { key: "nav.about", to: "/about" },
  { key: "nav.projects", to: "/projects" },
  { key: "nav.contact", to: "/contact" },
];

function isActive(to: string) {
  return to === "/" ? route.path === "/" : route.path.startsWith(to);
}

// Close the mobile menu whenever the route changes
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
  },
);
</script>

<template>
  <header class="sticky top-0 z-50 bg-primary-dark border-b-2 border-ink">
    <nav class="mx-auto max-w-[1180px] flex items-center justify-between gap-6 px-6 py-[18px] sm:px-8">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-3" aria-label="Home">
        <img src="/images/logo.png" alt="Sinver Aguiló" class="h-10 block" width="40" height="40" />
        <span class="font-mono text-cyan text-[13px] hidden sm:inline">~/sinver</span>
      </NuxtLink>

      <!-- Desktop nav -->
      <div class="hidden md:flex gap-1.5 font-display font-bold text-[13px] uppercase tracking-[0.02em]">
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="px-3.5 py-2 transition-colors" :class="isActive(item.to) ? 'bg-yellow text-ink-text' : 'text-primary-light hover:text-cyan'">
          {{ $t(item.key) }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <SharedLangSwitcher />
        <!-- Mobile toggle -->
        <button type="button" class="md:hidden inline-flex items-center justify-center border-2 border-ink text-primary-light p-2" aria-label="Toggle menu" @click="mobileMenuOpen = !mobileMenuOpen">
          <Icon :name="mobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3-solid'" class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>

    <!-- Mobile nav -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t-2 border-ink bg-surface">
      <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="block px-6 py-3 font-display font-bold text-sm uppercase tracking-[0.02em] border-b border-ink/60" :class="isActive(item.to) ? 'bg-yellow text-ink-text' : 'text-primary-light hover:text-cyan'">
        {{ $t(item.key) }}
      </NuxtLink>
    </div>
  </header>
</template>
