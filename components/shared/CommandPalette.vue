<script setup lang="ts">
const { t, setLocale, locale } = useI18n();
const localePath = useLocalePath();
const open = ref(false);
const query = ref("");
const active = ref(0);
const copied = ref(false);
const input = ref<HTMLInputElement | null>(null);
const EMAIL = "hello@sinveraguilo.com";

const pages = [
  { key: "nav.home", to: "/" },
  { key: "nav.about", to: "/about" },
  { key: "nav.projects", to: "/projects" },
  { key: "nav.blog", to: "/blog" },
  { key: "nav.contact", to: "/contact" },
];

const commands = computed(() => {
  const other = locale.value === "en" ? "es" : "en";
  return [
    ...pages.map((p) => ({ label: t("palette.go", { page: t(p.key) }), tag: "goto", run: () => navigateTo(localePath(p.to)) })),
    { label: t("palette.lang", { lang: other === "es" ? "Español" : "English" }), tag: "lang", run: () => setLocale(other) },
    {
      label: t("palette.cv"),
      tag: "pdf",
      run: () => {
        const a = document.createElement("a");
        a.href = "/Sinver-Aguilo-CV.pdf";
        a.download = "";
        a.click();
      },
    },
    {
      label: t("palette.copyEmail"),
      tag: "copy",
      keep: true,
      run: async () => {
        await navigator.clipboard?.writeText(EMAIL);
        copied.value = true;
        setTimeout(() => (copied.value = false), 1800);
      },
    },
  ];
});

const results = computed(() => {
  const q = query.value.trim().toLowerCase();
  return q ? commands.value.filter((c) => c.label.toLowerCase().includes(q) || c.tag.includes(q)) : commands.value;
});

watch(query, () => (active.value = 0));

async function show() {
  open.value = true;
  query.value = "";
  active.value = 0;
  await nextTick();
  input.value?.focus();
}
function close() {
  open.value = false;
}
async function exec(i: number) {
  const c = results.value[i];
  if (!c) return;
  if (!c.keep) close();
  await c.run();
}
function onInputKey(e: KeyboardEvent) {
  const n = results.value.length;
  if (e.key === "ArrowDown" && n) (e.preventDefault(), (active.value = (active.value + 1) % n));
  else if (e.key === "ArrowUp" && n) (e.preventDefault(), (active.value = (active.value - 1 + n) % n));
  else if (e.key === "Enter") (e.preventDefault(), exec(active.value));
}
function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    open.value ? close() : show();
  } else if (e.key === "Escape" && open.value) close();
}

onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <button type="button" class="hidden md:inline-flex items-center gap-2 border-2 border-ink px-3 min-h-11 font-mono text-xs text-muted hover:text-cyan cursor-pointer" :aria-label="$t('palette.hint')" @click="show">
    <span>{{ $t("palette.hint") }}</span>
    <kbd class="border border-ink px-1.5 py-0.5 text-[11px] text-dim">Ctrl K</kbd>
  </button>

  <Teleport to="body">
    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-[100] flex items-start justify-center bg-ink/80 px-4 pt-[15vh]" role="dialog" aria-modal="true" :aria-label="$t('palette.hint')" @mousedown.self="close">
        <div class="w-full max-w-xl border-2 border-ink bg-surface shadow-[8px_8px_0_#22d3ee]">
          <div class="flex items-center border-b-2 border-ink">
            <span class="pl-4 font-mono text-cyan" aria-hidden="true">&gt;</span>
            <input ref="input" v-model="query" type="text" role="combobox" aria-expanded="true" aria-controls="palette-list" :placeholder="$t('palette.placeholder')" class="flex-1 bg-transparent px-3 py-4 font-mono text-sm text-white outline-none placeholder:text-dim" @keydown="onInputKey" />
            <button type="button" class="px-4 font-mono text-sm text-muted hover:text-white cursor-pointer" :aria-label="$t('palette.close')" @click="close">esc</button>
          </div>
          <ul id="palette-list" role="listbox" class="m-0 max-h-[50vh] list-none overflow-y-auto p-0">
            <li v-for="(c, i) in results" :key="c.tag + c.label" role="option" :aria-selected="i === active" class="flex cursor-pointer items-center justify-between px-4 py-3 font-display text-sm font-bold uppercase" :class="i === active ? 'bg-yellow text-ink-text' : 'text-primary-light'" @mousemove="active = i" @click="exec(i)">
              <span>{{ c.tag === "copy" && copied ? $t("palette.copied") : c.label }}</span>
              <span class="font-mono text-[11px] font-medium normal-case opacity-70">{{ c.tag }}</span>
            </li>
            <li v-if="!results.length" class="px-4 py-6 text-center font-mono text-sm text-dim">{{ $t("palette.empty") }}</li>
          </ul>
          <div class="border-t-2 border-ink px-4 py-2 font-mono text-[11px] text-dim">{{ $t("palette.hintKeys") }}</div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
