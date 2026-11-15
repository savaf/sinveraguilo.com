<script setup lang="ts">
const steps = [0, 1, 2, 3];
</script>

<template>
  <section class="border-t-2 border-ink bg-surface">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-10">
      <p class="m-0 font-mono text-xs font-bold uppercase tracking-[0.06em] text-cyan">{{ $t("process.kicker") }}</p>
      <h2 class="m-0 mt-2 font-display font-black uppercase text-primary-light tracking-[-0.01em] text-[clamp(2rem,4.5vw,3rem)] max-w-[20ch]">{{ $t("process.title") }}</h2>
      <ol class="m-0 mt-10 p-0 list-none grid gap-0 border-2 border-ink sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="i in steps" :key="i" v-reveal class="group relative overflow-hidden bg-primary-dark p-6 border-ink border-b-2 last:border-b-0 sm:[&:nth-child(odd)]:border-r-2 lg:border-b-0 lg:border-r-2 lg:last:border-r-0 transition-colors hover:bg-indigo-600">
          <span class="block font-display font-black leading-[0.85] text-[clamp(4.5rem,9vw,6.5rem)] text-transparent [-webkit-text-stroke:2px_var(--accent)] group-hover:[-webkit-text-stroke-color:#fde047]" aria-hidden="true">0{{ i + 1 }}</span>
          <h3 class="m-0 mt-4 font-display font-extrabold uppercase text-xl text-primary-light">{{ $t(`process.steps[${i}].t`) }}</h3>
          <p class="m-0 mt-2 text-sm leading-relaxed text-muted group-hover:text-indigo-50">{{ $t(`process.steps[${i}].d`) }}</p>
        </li>
      </ol>
      <a href="#brief" class="mt-8 inline-block font-mono text-sm font-bold uppercase text-yellow underline underline-offset-4 hover:text-cyan">{{ $t("process.cta") }} ↓</a>
    </div>
  </section>
</template>
