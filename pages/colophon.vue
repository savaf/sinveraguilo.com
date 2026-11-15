<script setup lang="ts">
const localePath = useLocalePath();
definePageMeta({ title: "colophon.title" });

// Facts below come from this repo's own config and package.json.
const specs = ["framework", "style", "content", "i18n", "type", "icons", "host"] as const;
const features = ["palette", "a11y", "resume"] as const;
</script>

<template>
  <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-10 sm:py-24">
    <p class="m-0 font-mono text-[13px] text-cyan">{{ $t("colophon.label") }}</p>
    <h1 class="m-0 mt-3 font-display text-[clamp(2.5rem,8vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.03em]">{{ $t("colophon.title") }}</h1>
    <p class="mt-6 max-w-[62ch] text-lg text-primary-light">{{ $t("colophon.intro") }}</p>

    <div class="mt-14 grid gap-10 lg:grid-cols-2">
      <section :aria-label="$t('colophon.specsTitle')">
        <h2 class="m-0 font-display text-sm font-extrabold uppercase text-yellow">{{ $t("colophon.specsTitle") }}</h2>
        <dl class="m-0 mt-4 border-2 border-ink shadow-[6px_6px_0_var(--accent)]">
          <div v-for="s in specs" :key="s" class="grid grid-cols-[7rem_1fr] gap-4 border-b-2 border-ink bg-surface px-4 py-3 last:border-b-0">
            <dt class="font-mono text-[13px] text-cyan">{{ $t(`colophon.specs.${s}.k`) }}</dt>
            <dd class="m-0 font-mono text-sm text-slate-50">{{ $t(`colophon.specs.${s}.v`) }}</dd>
          </div>
        </dl>
      </section>

      <section :aria-label="$t('colophon.featuresTitle')">
        <h2 class="m-0 font-display text-sm font-extrabold uppercase text-yellow">{{ $t("colophon.featuresTitle") }}</h2>
        <ol class="m-0 mt-4 list-none p-0">
          <li v-for="(f, i) in features" :key="f" class="flex gap-4 border-b-2 border-ink py-3">
            <span class="font-mono text-[13px] text-cyan">{{ String(i + 1).padStart(2, "0") }}</span>
            <span>
              <span class="block font-display text-base font-extrabold uppercase">{{ $t(`colophon.features.${f}.k`) }}</span>
              <span class="block text-sm text-primary-light">{{ $t(`colophon.features.${f}.v`) }}</span>
            </span>
          </li>
        </ol>
      </section>
    </div>

    <p class="mt-14 flex flex-wrap items-center gap-4">
      <NuxtLink :to="localePath('/contact')" class="border-2 border-ink bg-cyan px-5 py-3 font-display text-sm font-extrabold uppercase text-ink-text shadow-[4px_4px_0_#6366f1] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5">{{ $t("cta.button") }} →</NuxtLink>
      <span class="font-mono text-[13px] text-dim">{{ $t("colophon.hint") }}</span>
    </p>
  </div>
</template>
