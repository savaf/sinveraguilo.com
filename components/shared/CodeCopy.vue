<script setup lang="ts">
// Adds a language label and a one-click copy button to every code block inside the slot.
// Plain DOM, no dependencies; labels come from i18n so both locales are covered.
const { t } = useI18n();
const root = ref<HTMLElement | null>(null);
const cleanups: Array<() => void> = [];

onMounted(() => {
  root.value?.querySelectorAll<HTMLPreElement>("pre").forEach((pre) => {
    if (pre.dataset.copyReady) return;
    pre.dataset.copyReady = "1";
    pre.style.position = "relative";
    pre.style.paddingTop = "2.5rem";
    const lang = (pre.className + " " + (pre.querySelector("code")?.className || "")).match(/language-([\w-]+)/)?.[1] || "code";

    const bar = document.createElement("div");
    bar.style.cssText = "position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:0.35rem 0.6rem 0.35rem 0.9rem;border-bottom:2px solid var(--accent);font-family:ui-monospace,monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.06em";
    const label = document.createElement("span");
    label.textContent = lang;
    label.style.color = "var(--accent)";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = t("code.copy");
    btn.style.cssText = "font:inherit;text-transform:inherit;letter-spacing:inherit;padding:0.2rem 0.6rem;border:2px solid var(--accent);color:var(--accent);background:transparent;cursor:pointer";
    let timer: ReturnType<typeof setTimeout>;
    const onClick = async () => {
      try {
        await navigator.clipboard.writeText(pre.querySelector("code")?.innerText.trimEnd() ?? pre.innerText);
        btn.textContent = t("code.copied");
      } catch {
        btn.textContent = t("code.failed");
      }
      clearTimeout(timer);
      timer = setTimeout(() => (btn.textContent = t("code.copy")), 1800);
    };
    btn.addEventListener("click", onClick);
    cleanups.push(() => {
      btn.removeEventListener("click", onClick);
      clearTimeout(timer);
    });
    bar.append(label, btn);
    pre.prepend(bar);
  });
});
onBeforeUnmount(() => cleanups.forEach((fn) => fn()));
</script>

<template>
  <div ref="root"><slot /></div>
</template>
