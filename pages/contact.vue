<script setup lang="ts">
definePageMeta({
  title: "Contact",
});
</script>

<template>
  <section class="relative overflow-hidden border-b-2 border-ink">
    <div class="absolute inset-0 grid-overlay" />
    <div class="relative mx-auto max-w-[1180px] px-6 py-16 sm:px-10 sm:py-20 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-14 items-start">
      <ContactDetails />
      <ContactForm />
    </div>
  </section>
</template>
