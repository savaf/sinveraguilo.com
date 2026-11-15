<script setup lang="ts">
// Adds a "#" button to every h2/h3 with an id inside the slot that copies a deep link to that section.
const { t } = useI18n();
const root = ref<HTMLElement | null>(null);
const cleanups: Array<() => void> = [];

onMounted(() => {
  root.value?.querySelectorAll<HTMLElement>("h2[id], h3[id]").forEach((h) => {
    if (h.dataset.linkReady) return;
    h.dataset.linkReady = "1";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "#";
    btn.setAttribute("aria-label", t("headingLink.copy"));
    btn.title = t("headingLink.copy");
    btn.style.cssText = "margin-left:0.6rem;font:inherit;font-family:ui-monospace,monospace;color:var(--accent);background:transparent;border:0;cursor:pointer;opacity:0.45;text-transform:none";
    let timer: ReturnType<typeof setTimeout>;
    const onClick = async () => {
      const url = `${location.origin}${location.pathname}#${h.id}`;
      try {
        await navigator.clipboard.writeText(url);
        history.replaceState(null, "", `#${h.id}`);
        btn.textContent = t("headingLink.copied");
      } catch {
        btn.textContent = t("headingLink.failed");
      }
      btn.style.opacity = "1";
      btn.style.fontSize = "0.5em";
      clearTimeout(timer);
      timer = setTimeout(() => {
        btn.textContent = "#";
        btn.style.opacity = "0.45";
        btn.style.fontSize = "";
      }, 1800);
    };
    const hi = () => (btn.style.opacity = "1");
    const lo = () => (btn.textContent === "#" ? (btn.style.opacity = "0.45") : null);
    btn.addEventListener("click", onClick);
    btn.addEventListener("mouseenter", hi);
    btn.addEventListener("focus", hi);
    btn.addEventListener("mouseleave", lo);
    btn.addEventListener("blur", lo);
    cleanups.push(() => {
      btn.removeEventListener("click", onClick);
      clearTimeout(timer);
    });
    h.append(btn);
  });
});
onBeforeUnmount(() => cleanups.forEach((fn) => fn()));
</script>

<template>
  <div ref="root"><slot /></div>
</template>
