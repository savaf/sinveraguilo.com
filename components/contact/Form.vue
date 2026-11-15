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
const { t: tr } = useI18n();
function applyStarter(key: string) {
  activeStarter.value = key;
  form.value.subject = tr(`contact.starters.${key}.subject`);
  form.value.message = tr(`contact.starters.${key}.body`);
  nextTick(() => document.getElementById("message")?.focus());
}

const status = ref<"idle" | "sending" | "sent" | "error">("idle");

async function sendEmail() {
  status.value = "sending";
  try {
    await $fetch("/api/contact", { method: "POST", body: form.value });
    status.value = "sent";
    form.value = { name: "", email: "", subject: "", message: "" };
  } catch {
    status.value = "error";
  }
}

const mailto = computed(() => `mailto:hello@sinveraguilo.com?subject=${encodeURIComponent(form.value.subject)}&body=${encodeURIComponent(form.value.message)}`);

const inputClass = "w-full box-border border-2 border-ink bg-primary-dark text-primary-light font-sans text-[15px] px-3.5 py-3 outline-hidden focus:border-cyan";
const labelClass = "block font-display font-bold text-xs uppercase tracking-[0.04em] text-muted mb-2";
</script>

<template>
  <div>
    <div class="border-2 border-ink bg-surface shadow-[12px_12px_0_#6366f1] p-9">
      <form class="flex flex-col gap-5" @submit.prevent="sendEmail">
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
        <p v-if="status === 'sent'" class="m-0 font-mono text-[13px] text-cyan">{{ $t("contact.sentOk") }}</p>
        <p v-if="status === 'error'" class="m-0 font-mono text-[13px] text-yellow">{{ $t("contact.sentError") }}</p>
      </form>
    </div>

    <aside class="mt-10 border-2 border-ink bg-primary-dark" aria-labelledby="mail-preview-title">
      <div class="flex items-center justify-between gap-3 border-b-2 border-ink px-4 py-2.5 bg-surface">
        <h2 id="mail-preview-title" class="m-0 font-mono text-[11px] uppercase tracking-[0.06em] text-dim">{{ $t("contact.preview") }}</h2>
        <a :href="mailto" class="font-mono text-[11px] uppercase text-cyan hover:text-yellow underline underline-offset-4">{{ $t("contact.mailApp") }} ↗</a>
      </div>
      <dl class="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 px-4 pt-4 font-mono text-[13px]">
        <dt class="text-dim">{{ $t("contact.pvFrom") }}</dt>
        <dd class="m-0 text-primary-light break-words">{{ form.name || $t("contact.namePh") }} &lt;{{ form.email || "…" }}&gt;</dd>
        <dt class="text-dim">{{ $t("contact.pvTo") }}</dt>
        <dd class="m-0 text-primary-light">Sinver Aguilo &lt;hello@sinveraguilo.com&gt;</dd>
        <dt class="text-dim">{{ $t("contact.subject") }}</dt>
        <dd class="m-0 text-yellow break-words">{{ form.subject || "…" }}</dd>
      </dl>
      <pre class="m-0 px-4 py-4 min-h-24 whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-slate-300 border-t-2 border-ink mt-4">{{ form.message || $t("contact.messagePh") }}<span class="inline-block w-2 h-4 align-middle bg-cyan ml-0.5 animate-pulse motion-reduce:animate-none" aria-hidden="true" /></pre>
    </aside>
  </div>
</template>
