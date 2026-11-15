<script setup lang="ts">
const localePath = useLocalePath();
const router = useRouter();
const route = useRoute();
const open = ref(false);
const pending = ref(false);
const closeBtn = ref<HTMLButtonElement | null>(null);
let timer: ReturnType<typeof setTimeout> | undefined;

const routes: Record<string, string> = { h: "/", a: "/about", p: "/projects", b: "/blog", c: "/contact", r: "/resume" };
const labels: Record<string, string> = { h: "nav.home", a: "nav.about", p: "nav.projects", b: "nav.blog", c: "nav.contact", r: "palette.resume" };
const other = [
  { keys: ["⌘/Ctrl", "K"], k: "shortcuts.palette" },
  { keys: ["B"], k: "shortcuts.blueprint" },
  { keys: ["P"], k: "shortcuts.paper" },
  { keys: ["L"], k: "shortcuts.spotlight" },
  { keys: ["M"], k: "shortcuts.rain" },
  { keys: ["?"], k: "shortcuts.help" },
  { keys: ["Esc"], k: "shortcuts.close" },
];

async function show() {
  open.value = true;
  await nextTick();
  closeBtn.value?.focus();
}
function close() {
  open.value = false;
}
function typing(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null;
  return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
}
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape" && open.value) return close();
  if (e.metaKey || e.ctrlKey || e.altKey || typing(e)) return;
  if (e.key === "?") {
    e.preventDefault();
    return open.value ? close() : show();
  }
  const k = e.key.toLowerCase();
  if (pending.value) {
    pending.value = false;
    clearTimeout(timer);
    if (routes[k]) {
      e.preventDefault();
      e.stopImmediatePropagation();
      close();
      router.push(localePath(routes[k]));
    }
  } else if (k === "g" && !open.value) {
    pending.value = true;
    timer = setTimeout(() => (pending.value = false), 1500);
  }
}
watch(() => route.path, close);
onMounted(() => window.addEventListener("keydown", onKey, true));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey, true);
  clearTimeout(timer);
});
</script>

<template>
  <Teleport to="body">
    <div v-if="pending" class="fixed bottom-6 left-6 z-[90] border-2 border-ink bg-yellow px-3 py-2 font-mono text-xs font-bold uppercase text-ink-text shadow-[4px_4px_0_var(--accent)]" role="status">g → {{ Object.keys(routes).join(" · ") }}</div>
    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/80 px-4 py-8" role="dialog" aria-modal="true" :aria-label="$t('shortcuts.title')" @mousedown.self="close">
        <div class="w-full max-w-lg border-2 border-ink bg-surface shadow-[8px_8px_0_var(--accent)]">
          <div class="flex items-center justify-between border-b-2 border-ink px-5 py-3">
            <span class="font-mono text-[13px] text-cyan">{{ $t("shortcuts.title") }}</span>
            <button ref="closeBtn" type="button" class="font-mono text-sm text-muted hover:text-white cursor-pointer" :aria-label="$t('palette.close')" @click="close">esc</button>
          </div>
          <div class="px-5 py-5">
            <p class="m-0 font-display text-sm font-extrabold uppercase text-yellow">{{ $t("shortcuts.goto") }}</p>
            <ul class="m-0 mt-3 grid list-none grid-cols-2 gap-2 p-0">
              <li v-for="(to, key) in routes" :key="key" class="flex items-center gap-2 text-sm">
                <kbd class="border-2 border-ink px-1.5 font-mono text-xs text-cyan">g</kbd><kbd class="border-2 border-ink px-1.5 font-mono text-xs text-cyan uppercase">{{ key }}</kbd>
                <span class="text-primary-light">{{ $t(labels[key]) }}</span>
              </li>
            </ul>
            <p class="m-0 mt-6 font-display text-sm font-extrabold uppercase text-yellow">{{ $t("shortcuts.more") }}</p>
            <ul class="m-0 mt-3 grid list-none gap-2 p-0">
              <li v-for="o in other" :key="o.k" class="flex items-center gap-2 text-sm">
                <span class="flex gap-1"
                  ><kbd v-for="x in o.keys" :key="x" class="border-2 border-ink px-1.5 font-mono text-xs text-cyan">{{ x }}</kbd></span
                >
                <span class="text-primary-light">{{ $t(o.k) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
