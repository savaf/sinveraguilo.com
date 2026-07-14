<script setup lang="ts">
withDefaults(
  defineProps<{
    topBorder?: boolean;
  }>(),
  { topBorder: true },
);
</script>

<template>
  <section class="relative overflow-hidden bg-indigo" :class="topBorder ? 'border-t-2 border-ink' : ''">
    <div class="absolute inset-0 grid-overlay--light" />
    <div class="relative mx-auto max-w-[1180px] px-6 py-16 sm:px-10 flex flex-wrap items-center justify-between gap-6">
      <div>
        <h2 class="m-0 font-display font-black uppercase text-white tracking-[-0.01em] text-[clamp(2.25rem,5vw,3.5rem)]">
          {{ $t("cta.title") }}
        </h2>
        <p class="mt-3 text-base text-indigo-100 max-w-[44ch]">{{ $t("cta.subtitle") }}</p>
      </div>
      <NuxtLink to="/contact" class="font-display font-extrabold uppercase text-base text-ink-text bg-yellow border-2 border-ink px-[30px] py-[18px] shadow-[6px_6px_0_#0a1420] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#0a1420]"> {{ $t("cta.button") }} → </NuxtLink>
    </div>
  </section>
</template>
