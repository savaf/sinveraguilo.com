<script setup lang="ts">
const { tr } = useLocalized();
const { locale, t } = useI18n();
const localePath = useLocalePath();

definePageMeta({ title: "resume.title" });

const { data } = await useAsyncData("resumePageContent", async () => {
  const [educations, jobs] = await Promise.all([queryContent("education").find(), queryContent("experiences").find()]);
  return { educations, jobs };
});
const educations = data.value!.educations as any[];
const jobs = data.value!.jobs as any[];

function range(j: any) {
  const end = j.endDate ? formatMonth(j.endDate, locale.value) : t("experience.present");
  return `${formatMonth(j.startDate, locale.value)} – ${end}`;
}

// Skills ranked by how many roles list them: derived from the content, not claimed.
const topSkills = computed(() => {
  const count = new Map<string, number>();
  for (const j of jobs) for (const s of j.skills ?? []) count.set(s, (count.get(s) ?? 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14);
});

// Tailor lens: picked skills float matching roles to the top; the rest dim on screen and drop out of print.
const picked = ref<string[]>([]);
const toggle = (s: string) => (picked.value = picked.value.includes(s) ? picked.value.filter((x) => x !== s) : [...picked.value, s]);
const matches = (j: any) => (j.skills ?? []).filter((s: string) => picked.value.includes(s)).length;
const shownJobs = computed(() =>
  picked.value.length
    ? jobs
        .map((j, i) => ({ j, i, m: matches(j) }))
        .sort((a, b) => b.m - a.m || a.i - b.i)
        .map((x) => x.j)
    : jobs,
);
const matched = computed(() => jobs.filter((j) => matches(j) > 0).length);

function print() {
  window.print();
}
</script>

<template>
  <div class="resume bg-primary-dark">
    <div class="mx-auto max-w-[860px] px-6 py-12 sm:px-10">
      <div class="no-print flex flex-wrap items-center gap-3 mb-8">
        <button type="button" class="cursor-pointer font-display font-extrabold uppercase text-sm text-ink-text bg-yellow border-2 border-ink px-5 py-3 shadow-[4px_4px_0_#6366f1] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5" @click="print">{{ $t("resume.print") }}</button>
        <a href="/Sinver-Aguilo-CV.pdf" download class="font-display font-extrabold uppercase text-sm text-primary-light bg-surface border-2 border-ink px-5 py-3 hover:border-cyan">{{ $t("hero.ctaCV") }}</a>
        <NuxtLink :to="localePath('/contact')" class="font-display font-extrabold uppercase text-sm text-ink-text bg-cyan border-2 border-ink px-5 py-3">{{ $t("cta.button") }} →</NuxtLink>
      </div>

      <header class="border-b-2 border-ink pb-5 mb-6">
        <h1 class="m-0 font-display font-black uppercase leading-none text-slate-50 text-[clamp(2.25rem,6vw,3.5rem)]">Sinver <span class="text-cyan">Aguiló</span></h1>
        <p class="mt-2 mb-0 font-mono text-sm text-yellow">{{ $t("hero.eyebrow") }} · {{ $t("about.location") }}</p>
        <p class="mt-1 mb-0 font-mono text-xs text-dim">hello@sinveraguilo.com · github.com/savaf · linkedin.com/in/sinver-aguilo</p>
      </header>

      <p class="mt-0 mb-6 text-[15px] leading-relaxed text-slate-300">{{ $t("about.bio1") }}</p>

      <section class="mb-6">
        <h2 class="r-h font-display">{{ $t("resume.skills") }}</h2>
        <div class="flex flex-wrap gap-2 font-mono text-xs">
          <span v-for="[s] in topSkills" :key="s" class="border-2 border-ink bg-surface text-slate-200 px-2.5 py-1">{{ s }}</span>
        </div>
        <div class="no-print mt-5 border-2 border-ink bg-surface p-4">
          <p class="m-0 font-mono text-xs font-bold uppercase tracking-[0.06em] text-cyan">{{ $t("lens.title") }}</p>
          <p class="m-0 mt-1 text-[13px] text-muted">{{ $t("lens.hint") }}</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <button v-for="[s] in topSkills" :key="s" type="button" :aria-pressed="picked.includes(s)" class="cursor-pointer border-2 px-2.5 py-1 font-mono text-xs transition-colors" :class="picked.includes(s) ? 'border-yellow bg-yellow text-ink-text font-bold' : 'border-ink text-slate-200 hover:border-yellow'" @click="toggle(s)">{{ s }}</button>
          </div>
          <p class="m-0 mt-3 font-mono text-xs text-yellow" aria-live="polite">
            <template v-if="picked.length">
              {{ $t("lens.result", { m: matched, n: jobs.length }) }}
              <button type="button" class="ml-2 cursor-pointer underline text-slate-200 hover:text-cyan" @click="picked = []">{{ $t("lens.clear") }}</button>
            </template>
          </p>
        </div>
        <p v-if="picked.length" class="print-only mt-3 font-mono text-xs">{{ $t("lens.printNote", { skills: picked.join(", ") }) }}</p>
      </section>

      <section class="mb-6">
        <h2 class="r-h font-display">{{ $t("about.experienceTitle") }}</h2>
        <article v-for="j in shownJobs" :key="j._path" class="job mb-5 transition-opacity" :class="picked.length && !matches(j) ? 'opacity-40 job-off' : ''">
          <div class="flex flex-wrap items-baseline justify-between gap-x-3">
            <h3 class="m-0 font-grotesk font-semibold text-[17px] text-primary-light">
              {{ tr(j.position) }} <span class="text-cyan">@ {{ j.company }}</span>
            </h3>
            <span class="font-mono text-xs text-yellow whitespace-nowrap">{{ range(j) }}</span>
          </div>
          <ul class="mt-1.5 mb-0 pl-5 text-[13.5px] leading-snug text-slate-300">
            <li v-for="line in tr(j.description).slice(0, 3)" :key="line" class="mb-1">{{ line }}</li>
          </ul>
        </article>
      </section>

      <section>
        <h2 class="r-h font-display">{{ $t("about.educationTitle") }}</h2>
        <p v-for="e in educations" :key="e._path" class="m-0 mb-1 text-[14px] text-slate-300">
          <strong class="text-primary-light">{{ tr(e.title) }}</strong> · {{ e.company }} · <span class="font-mono text-xs text-dim">{{ e.date }}</span>
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.r-h {
  margin: 0 0 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  font-size: 1.25rem;
  color: #f8fafc;
  border-bottom: 2px solid #123049;
  padding-bottom: 0.25rem;
}
</style>

<style>
.print-only {
  display: none;
}
@media print {
  header,
  footer,
  .no-print,
  .fixed {
    display: none !important;
  }
  html,
  body,
  .resume,
  .resume * {
    background: #fff !important;
    color: #111 !important;
    box-shadow: none !important;
    border-color: #999 !important;
  }
  .resume .job {
    break-inside: avoid;
  }
  .resume .job-off {
    display: none !important;
  }
  .resume .print-only {
    display: block !important;
  }
  @page {
    margin: 14mm;
  }
}
</style>
