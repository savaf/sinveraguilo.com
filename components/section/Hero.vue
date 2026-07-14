<script setup lang="ts">
const techs = ["Vue", "React", "Node", "TypeScript", "Angular"];
</script>

<template>
  <section class="relative border-b-2 border-ink overflow-hidden">
    <div class="absolute inset-0 grid-overlay" />
    <div class="relative mx-auto max-w-[1180px] grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr]">
      <!-- Left -->
      <div class="px-6 py-14 sm:px-10 sm:py-16 md:border-r-2 border-ink">
        <div class="inline-flex items-center gap-2 font-mono text-xs font-medium text-ink-text bg-mint border-2 border-ink px-3 py-1.5 mb-6">
          <span class="w-2 h-2 rounded-full bg-ink-text" />
          {{ $t("hero.available") }}
        </div>

        <h1 class="m-0 font-display font-black uppercase text-slate-50 leading-[0.9] tracking-[-0.02em] text-[clamp(3.25rem,7vw,5.25rem)]">Sinver<br /><span class="text-cyan">Aguiló</span></h1>

        <p class="mt-5 font-mono text-[15px] leading-relaxed text-yellow max-w-[40ch]"><span class="text-dim">const role = </span>"{{ $t("hero.eyebrow") }}"</p>

        <p class="mt-4 font-grotesk text-[22px] font-medium leading-snug text-slate-200 max-w-[28ch]">
          {{ $t("hero.tagline") }}
        </p>

        <!-- Split CTA -->
        <div class="mt-9">
          <div class="group inline-flex w-max border-2 border-ink shadow-[6px_6px_0_#22d3ee] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#22d3ee]">
            <NuxtLink to="/projects" class="font-display font-extrabold uppercase text-[15px] bg-indigo text-white px-[26px] py-[15px] border-r-2 border-ink">
              {{ $t("hero.ctaWork") }}
            </NuxtLink>
            <a href="/Sinver-Aguilo-CV.pdf" download class="font-display font-extrabold uppercase text-[15px] bg-primary-dark text-primary-light px-[26px] py-[15px]">
              {{ $t("hero.ctaCV") }}
            </a>
          </div>
        </div>

        <!-- Tech tags -->
        <div class="flex flex-wrap gap-2 mt-8 font-mono text-xs font-medium">
          <span v-for="(tech, i) in techs" :key="tech" class="border-2 border-ink px-3 py-[5px]" :class="i === 0 ? 'text-ink-text bg-yellow' : 'text-slate-200 bg-surface'">
            {{ tech }}
          </span>
        </div>
      </div>

      <!-- Right -->
      <div class="relative flex items-stretch bg-surface min-h-[420px]">
        <NuxtImg src="/images/portrait.jpg" alt="Sinver Aguiló" width="575" height="522" class="w-full object-cover grayscale contrast-[1.05]" />
        <div class="absolute left-0 bottom-0 font-mono font-bold text-xs text-ink-text bg-cyan px-3.5 py-2 border-t-2 border-r-2 border-ink">
          {{ $t("hero.label") }}
        </div>
      </div>
    </div>
  </section>
</template>
