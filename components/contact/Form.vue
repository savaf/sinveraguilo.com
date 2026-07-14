<script setup lang="ts">
const form = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

function sendEmail() {
  const { name, email, subject, message } = form.value;
  const body = `${message}\n\n${name}\n${email}`;
  window.location.href = `mailto:hello@sinveraguilo.com?subject=${encodeURIComponent(`${subject} - ${name}`)}&body=${encodeURIComponent(body)}`;
}

const inputClass = "w-full box-border border-2 border-ink bg-primary-dark text-primary-light font-sans text-[15px] px-3.5 py-3 outline-hidden focus:border-cyan";
const labelClass = "block font-display font-bold text-xs uppercase tracking-[0.04em] text-muted mb-2";
</script>

<template>
  <div class="border-2 border-ink bg-surface shadow-[12px_12px_0_#6366f1] p-9">
    <div class="font-mono text-xs text-cyan mb-6">{{ $t("contact.formLabel") }}</div>
    <form class="flex flex-col gap-5" @submit.prevent="sendEmail">
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
      <button type="submit" aria-label="Send message" class="self-start font-display font-extrabold uppercase text-[15px] text-ink-text bg-yellow border-2 border-ink px-[30px] py-4 shadow-[5px_5px_0_#22d3ee] cursor-pointer transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#22d3ee]">{{ $t("contact.send") }} →</button>
    </form>
  </div>
</template>
