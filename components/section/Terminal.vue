<script setup lang="ts">
import type { Localized } from "~/utils/i18n";

type Exp = { company: string; position: Localized<string>; startDate?: string; endDate?: string | null };
type Line = { kind: "in" | "out" | "dim"; text: string };

const { t, locale } = useI18n();
const { tr } = useLocalized();
const localePath = useLocalePath();

const { data: projects } = await useAsyncData("terminal_projects", () => queryContent("projects").find());
const { data: exps } = await useAsyncData("terminal_experiences", () => queryContent("experiences").find());

const commands = ["help", "whoami", "projects", "experience", "cv", "contact", "clear"];
const lines = ref<Line[]>([]);
const input = ref("");
const history = ref<string[]>([]);
const hIdx = ref(-1);
const screen = ref<HTMLElement | null>(null);
const field = ref<HTMLInputElement | null>(null);

function out(text: string, kind: Line["kind"] = "out") {
  lines.value.push({ kind, text });
}

function run(raw: string) {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  if (!cmd) return;
  out(raw.trim(), "in");
  history.value.push(raw.trim());
  hIdx.value = -1;
  const list = (projects.value || []) as any[];
  switch (cmd.toLowerCase()) {
    case "help":
      commands.forEach((c) => out(`${c.padEnd(11)} ${t(`terminal.cmd.${c}`)}`));
      out(`open <n>    ${t("terminal.cmd.open")}`);
      break;
    case "whoami":
      out(`Sinver Aguiló · ${t("hero.eyebrow")}`);
      out(t("hero.tagline"), "dim");
      break;
    case "projects":
      list.forEach((p, i) => out(`[${i + 1}] ${p.title}`));
      out(t("terminal.openHint"), "dim");
      break;
    case "open": {
      const p = list[Number(args[0]) - 1];
      if (!p) return out(t("terminal.badIndex"), "dim");
      out(`→ ${p.title}`);
      navigateTo(localePath(p._path));
      break;
    }
    case "experience":
      [...((exps.value || []) as Exp[])]
        .sort((a, b) => (b.startDate || "").localeCompare(a.startDate || ""))
        .slice(0, 5)
        .forEach((e) => out(`${e.startDate} → ${e.endDate || t("experience.present")}  ${e.company} · ${tr(e.position)}`));
      break;
    case "cv":
      out(t("terminal.cvStart"));
      window.location.href = "/Sinver-Aguilo-CV.pdf";
      break;
    case "contact":
      out(`→ ${t("nav.contact")}`);
      navigateTo(localePath("/contact"));
      break;
    case "clear":
      lines.value = [];
      break;
    default:
      out(`${cmd}: ${t("terminal.notFound")}`, "dim");
  }
}

function submit() {
  run(input.value);
  input.value = "";
  nextTick(() => screen.value && (screen.value.scrollTop = screen.value.scrollHeight));
}

function recall(dir: -1 | 1) {
  if (!history.value.length) return;
  hIdx.value = Math.min(history.value.length - 1, Math.max(-1, hIdx.value + (dir === -1 ? 1 : -1)));
  input.value = hIdx.value === -1 ? "" : history.value[history.value.length - 1 - hIdx.value];
}

function chip(c: string) {
  run(c);
  nextTick(() => screen.value && (screen.value.scrollTop = screen.value.scrollHeight));
}

onMounted(() => out(t("terminal.welcome"), "dim"));
watch(locale, () => {
  lines.value = [];
  out(t("terminal.welcome"), "dim");
});
</script>

<template>
  <section id="terminal" class="mx-auto max-w-[1180px] px-6 pt-16 sm:px-10 sm:pt-[72px]">
    <div v-reveal class="flex items-center gap-4 mb-8">
      <h2 class="m-0 font-display font-black text-[clamp(2rem,6vw,2.75rem)] uppercase text-slate-50 tracking-[-0.01em]">{{ $t("terminal.title") }}</h2>
      <div class="flex-1 h-0.5 bg-ink" />
    </div>
    <p class="m-0 mb-6 text-[15px] text-slate-300 max-w-[60ch]">{{ $t("terminal.subtitle") }}</p>

    <div class="border-2 border-ink bg-footer-dark shadow-[6px_6px_0_#22d3ee]" @click="field?.focus()">
      <div class="flex items-center gap-2 border-b-2 border-ink px-4 py-2 font-mono text-xs text-dim">
        <span class="w-2.5 h-2.5 rounded-full bg-yellow" /><span class="w-2.5 h-2.5 rounded-full bg-cyan" /><span class="w-2.5 h-2.5 rounded-full bg-mint" />
        <span class="ml-2">~/savaf — zsh</span>
      </div>
      <div ref="screen" class="h-[300px] overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed" aria-live="polite">
        <div v-for="(l, i) in lines" :key="i" class="whitespace-pre-wrap break-words" :class="{ 'text-yellow': l.kind === 'in', 'text-slate-200': l.kind === 'out', 'text-dim': l.kind === 'dim' }"><span v-if="l.kind === 'in'" class="text-cyan">$ </span>{{ l.text }}</div>
        <form class="flex items-center gap-2 text-yellow" @submit.prevent="submit">
          <label for="term-input" class="text-cyan">$</label>
          <input id="term-input" ref="field" v-model="input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" class="flex-1 min-w-0 bg-transparent text-yellow outline-hidden font-mono text-[16px] sm:text-[13px]" :aria-label="$t('terminal.title')" @keydown.up.prevent="recall(-1)" @keydown.down.prevent="recall(1)" />
        </form>
      </div>
      <div class="flex flex-wrap gap-2 border-t-2 border-ink px-4 py-3 font-mono text-xs">
        <button v-for="c in commands.slice(0, 6)" :key="c" type="button" class="border-2 border-ink px-2.5 min-h-9 text-slate-200 hover:bg-yellow hover:text-ink-text cursor-pointer" @click.stop="chip(c)">{{ c }}</button>
      </div>
    </div>
  </section>
</template>
