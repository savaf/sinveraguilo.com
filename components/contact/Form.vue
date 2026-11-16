<script setup lang="ts">
const route = useRoute();
const pick = (v: unknown) => (typeof v === "string" ? v.slice(0, 1000) : "");
const form = ref({
  name: "",
  email: "",
  subject: pick(route.query.subject).slice(0, 120),
  message: pick(route.query.message),
});

// One-click starters: fill subject + a message skeleton so visitors never face a blank box.
const starters = ["project", "role", "audit", "hi"] as const;
const activeStarter = ref<string>("");
const { t: tr, locale } = useI18n();
const localePath = useLocalePath();
const sentOn = ref("");
function applyStarter(key: string) {
  activeStarter.value = key;
  form.value.subject = tr(`contact.starters.${key}.subject`);
  form.value.message = tr(`contact.starters.${key}.body`);
  nextTick(() => document.getElementById("message")?.focus());
}

// Draft autosave: a half-written message survives reloads and tab closes (local to this device).
const DRAFT_KEY = "contact-draft-v1";
const restored = ref(false);
onMounted(() => {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    if (d && !route.query.subject && !route.query.message && (d.message || d.subject || d.name || d.email)) {
      form.value = { name: pick(d.name).slice(0, 120), email: pick(d.email).slice(0, 200), subject: pick(d.subject).slice(0, 120), message: pick(d.message) };
      restored.value = true;
    }
  } catch {}
});
watch(
  form,
  (v) => {
    try {
      if (v.name || v.email || v.subject || v.message) localStorage.setItem(DRAFT_KEY, JSON.stringify(v));
      else localStorage.removeItem(DRAFT_KEY);
    } catch {}
  },
  { deep: true },
);
function discardDraft() {
  form.value = { name: "", email: "", subject: "", message: "" };
  restored.value = false;
  activeStarter.value = "";
}

const status = ref<"idle" | "sending" | "sent" | "error">("idle");

async function sendEmail() {
  status.value = "sending";
  try {
    await $fetch("/api/contact", { method: "POST", body: form.value });
    status.value = "sent";
    sentOn.value = new Date().toLocaleDateString(locale.value, { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
    restored.value = false;
    form.value = { name: "", email: "", subject: "", message: "" };
  } catch {
    status.value = "error";
  }
}

const inputClass = "w-full box-border border-2 border-ink bg-primary-dark text-primary-light font-sans text-[15px] px-3.5 py-3 outline-hidden focus:border-cyan";
const labelClass = "block font-display font-bold text-xs uppercase tracking-[0.04em] text-muted mb-2";
</script>

<template>
  <div>
    <div class="border-2 border-ink bg-surface shadow-[12px_12px_0_#6366f1] p-9">
      <form class="flex flex-col gap-5" @submit.prevent="sendEmail">
        <p v-if="restored" role="status" class="m-0 flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-primary-dark px-3.5 py-2.5 font-mono text-xs text-cyan">
          <span>{{ $t("contact.draftRestored") }}</span>
          <button type="button" class="font-mono text-xs uppercase text-yellow underline underline-offset-4 hover:text-cyan" @click="discardDraft">{{ $t("contact.draftDiscard") }}</button>
        </p>
        <fieldset class="m-0 border-0 p-0">
          <legend :class="labelClass">{{ $t("contact.startWith") }}</legend>
          <div class="flex flex-wrap gap-2">
            <button v-for="k in starters" :key="k" type="button" :aria-pressed="activeStarter === k" class="border-2 border-ink px-3.5 py-2 font-mono text-xs uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5" :class="activeStarter === k ? 'bg-yellow text-ink-text shadow-[3px_3px_0_var(--accent)]' : 'bg-primary-dark text-cyan hover:bg-cyan hover:text-ink-text'" @click="applyStarter(k)">{{ $t(`contact.starters.${k}.label`) }}</button>
          </div>
        </fieldset>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label :class="labelClass" for="name">{{ $t("contact.name") }}</label>
            <input id="name" v-model="form.name" :class="inputClass" name="name" type="text" required :placeholder="$t('contact.namePh')" />
          </div>
          <div>
            <label :class="labelClass" for="email">{{ $t("contact.emailField") }}</label>
            <input id="email" v-model="form.email" :class="inputClass" name="email" type="email" required :placeholder="$t('contact.emailPh')" />
          </div>
        </div>
        <div>
          <label :class="labelClass" for="subject">{{ $t("contact.subject") }}</label>
          <input id="subject" v-model="form.subject" :class="inputClass" name="subject" type="text" required :placeholder="$t('contact.subjectPh')" />
        </div>
        <div>
          <label :class="labelClass" for="message">{{ $t("contact.message") }}</label>
          <textarea id="message" v-model="form.message" :class="[inputClass, 'resize-y']" name="message" rows="6" required :placeholder="$t('contact.messagePh')" />
        </div>
        <button type="submit" aria-label="Send message" :disabled="status === 'sending'" class="self-start font-display font-extrabold uppercase text-[15px] text-ink-text bg-yellow border-2 border-ink px-[30px] py-4 shadow-[5px_5px_0_var(--accent)] cursor-pointer transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_var(--accent)] disabled:opacity-60 disabled:cursor-wait">{{ status === "sending" ? $t("contact.sending") : $t("contact.send") }} →</button>
        <div v-if="status === 'sent'" role="status" class="flex flex-wrap items-center gap-x-6 gap-y-4">
          <div class="postmark" aria-hidden="true">
            <span class="postmark-big">{{ $t("contact.stampSent") }}</span>
            <span class="postmark-date">{{ sentOn }}</span>
          </div>
          <div class="flex flex-col gap-1.5 font-mono text-[13px]">
            <p class="m-0 text-cyan">{{ $t("contact.sentOk") }}</p>
            <p class="m-0 text-dim">
              {{ $t("contact.meanwhile") }}
              <NuxtLink :to="localePath('/projects')" class="text-yellow underline underline-offset-4 hover:text-cyan">{{ $t("contact.meanwhileProjects") }}</NuxtLink>
              ·
              <NuxtLink :to="localePath('/blog')" class="text-yellow underline underline-offset-4 hover:text-cyan">{{ $t("contact.meanwhileBlog") }}</NuxtLink>
            </p>
          </div>
        </div>
        <p v-if="status === 'error'" class="m-0 font-mono text-[13px] text-yellow">{{ $t("contact.sentError") }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.postmark {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  border: 3px solid var(--color-yellow, #facc15);
  color: var(--color-yellow, #facc15);
  padding: 6px 14px;
  font-family: ui-monospace, monospace;
  text-transform: uppercase;
  transform: rotate(-6deg);
  animation: stamp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.postmark-big {
  font-weight: 800;
  font-size: 22px;
  letter-spacing: 0.12em;
}
.postmark-date {
  font-size: 11px;
  letter-spacing: 0.08em;
  border-top: 2px solid currentcolor;
  margin-top: 2px;
  padding-top: 2px;
}
@keyframes stamp {
  from {
    opacity: 0;
    transform: rotate(-14deg) scale(2.2);
  }
  to {
    opacity: 1;
    transform: rotate(-6deg) scale(1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .postmark {
    animation: none;
  }
}
</style>
