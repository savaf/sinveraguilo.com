<script setup lang="ts">
const items = [0, 1, 2, 3, 4];
</script>

<template>
  <section class="border-t-2 border-ink bg-primary-dark">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-10 lg:grid lg:grid-cols-[1fr_1.6fr] lg:gap-14">
      <div>
        <p class="m-0 font-mono text-xs font-bold uppercase tracking-[0.06em] text-cyan">{{ $t("faq.kicker") }}</p>
        <h2 class="m-0 mt-2 font-display font-black uppercase text-primary-light tracking-[-0.01em] text-[clamp(2rem,4.5vw,3rem)] max-w-[14ch]">{{ $t("faq.title") }}</h2>
        <a href="#brief" class="mt-6 inline-block font-mono text-sm font-bold uppercase text-yellow underline underline-offset-4 hover:text-cyan">{{ $t("faq.cta") }} ↓</a>
      </div>
      <div class="mt-10 border-2 border-ink lg:mt-0">
        <details v-for="i in items" :key="i" v-reveal class="group border-ink bg-surface not-last:border-b-2 open:bg-indigo-600">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-lg font-extrabold uppercase text-primary-light marker:hidden [&::-webkit-details-marker]:hidden">
            {{ $t(`faq.items[${i}].q`) }}
            <span class="font-mono text-2xl text-yellow transition-transform group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <p class="m-0 px-5 pb-5 text-sm leading-relaxed text-indigo-50">{{ $t(`faq.items[${i}].a`) }}</p>
        </details>
      </div>
    </div>
  </section>
</template>
