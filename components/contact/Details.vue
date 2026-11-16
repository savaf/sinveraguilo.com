<script setup lang="ts">
const { data: socialLinks } = await useAsyncData("contact_social_links", () => {
  return queryContent("social_links").findOne();
});

const hoverColor: Record<string, string> = {
  GitHub: "hover:bg-yellow hover:text-ink-text",
  LinkedIn: "hover:bg-cyan hover:text-ink-text",
};

// Live Santo Domingo clock (America/Santo_Domingo, UTC-4, no DST) plus one-click copy of the email.
const EMAIL = "hello@sinveraguilo.com";
const now = ref<Date | null>(null);
const { locale, t } = useI18n();
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  now.value = new Date();
  timer = setInterval(() => (now.value = new Date()), 1000);
});
onBeforeUnmount(() => clearInterval(timer));
const clock = computed(() => (now.value ? new Intl.DateTimeFormat(locale.value, { timeZone: "America/Santo_Domingo", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now.value) : "--:--:--"));
const isDay = computed(() => {
  if (!now.value) return true;
  const h = Number(new Intl.DateTimeFormat("en", { timeZone: "America/Santo_Domingo", hour: "2-digit", hour12: false }).format(now.value)) % 24;
  return h >= 6 && h < 19;
});

const copied = ref(false);
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    window.location.href = `mailto:${EMAIL}`;
  }
}
</script>

<template>
  <div>
    <h1 class="m-0 font-display font-black uppercase text-slate-50 leading-[0.9] tracking-[-0.02em] text-[clamp(2.75rem,6vw,4.5rem)]">
      {{ $t("contact.title") }}
    </h1>
    <p class="mt-5 mb-9 text-[17px] leading-relaxed text-slate-300 max-w-[42ch]">{{ $t("contact.intro") }}</p>

    <div class="flex flex-col gap-4">
      <a href="mailto:hello@sinveraguilo.com" class="flex items-center gap-3.5 border-2 border-ink bg-surface p-4 shadow-[5px_5px_0_var(--accent)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_var(--accent)]">
        <span class="flex p-2 bg-cyan text-ink-text border-2 border-ink">
          <Icon name="i-heroicons-envelope" class="w-[18px] h-[18px]" aria-hidden="true" />
        </span>
        <span>
          <span class="block font-mono text-[11px] text-dim uppercase">{{ $t("contact.email") }}</span>
          <span class="block font-grotesk font-semibold text-base text-primary-light">hello@sinveraguilo.com</span>
        </span>
      </a>

      <button type="button" class="self-start -mt-1 border-2 border-ink bg-primary-dark px-3.5 py-2 font-mono text-xs text-cyan transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-cyan hover:text-ink-text" @click="copyEmail">
        <Icon :name="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'" class="w-4 h-4 align-[-3px]" aria-hidden="true" />
        {{ copied ? t("contact.copied") : t("contact.copyEmail") }}
        <span class="sr-only" role="status" aria-live="polite">{{ copied ? t("contact.copied") : "" }}</span>
      </button>

      <div class="flex items-center gap-3.5 border-2 border-ink bg-surface p-4">
        <span class="flex p-2 bg-yellow text-ink-text border-2 border-ink">
          <Icon name="i-heroicons-map-pin" class="w-[18px] h-[18px]" aria-hidden="true" />
        </span>
        <span>
          <span class="block font-mono text-[11px] text-dim uppercase">{{ $t("contact.location") }}</span>
          <span class="block font-grotesk font-semibold text-base text-primary-light">Santo Domingo, DO</span>
        </span>
        <span class="ml-auto text-right font-mono" :title="t('contact.localTime')">
          <span class="block text-[11px] text-dim uppercase">{{ t("contact.localTime") }}</span>
          <span class="block text-base tabular-nums text-yellow">
            <span aria-hidden="true">{{ isDay ? "☀" : "☾" }}</span> {{ clock }} <span class="text-dim text-[11px]">UTC−4</span>
          </span>
        </span>
      </div>

      <div class="flex gap-3 mt-1">
        <NuxtLink v-for="social in socialLinks?.links" :key="social.id" :href="social.url" target="_blank" rel="noopener" class="flex border-2 border-ink bg-primary-dark text-primary-light p-3.5 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5" :class="hoverColor[social.name] || 'hover:bg-cyan hover:text-ink-text'">
          <span class="sr-only">{{ social.name }}</span>
          <Icon :name="social.icon" class="w-[22px] h-[22px]" aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
