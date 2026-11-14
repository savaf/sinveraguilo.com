<script setup lang="ts">
const localePath = useLocalePath();
const { data: posts } = await useAsyncData("home_posts", () => queryContent("blog").find());
// Files are numbered chronologically; newest first, top three.
const latest = computed(() => (posts.value || []).slice().reverse().slice(0, 3));
const pad = (i: number) => String(i + 1).padStart(2, "0");
</script>

<template>
  <section v-if="latest.length" class="border-t-2 border-ink bg-surface">
    <div class="mx-auto max-w-[1180px] px-6 py-16 sm:px-10">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="m-0 font-mono text-xs font-bold uppercase tracking-[0.06em] text-cyan">{{ $t("writing.kicker") }}</p>
          <h2 class="m-0 mt-2 font-display font-black uppercase text-slate-50 tracking-[-0.01em] text-[clamp(2rem,4.5vw,3rem)]">{{ $t("writing.title") }}</h2>
        </div>
        <NuxtLink :to="localePath('/blog')" class="font-mono text-sm font-bold uppercase text-yellow underline underline-offset-4 hover:text-cyan">{{ $t("writing.all") }} →</NuxtLink>
      </div>
      <ul class="m-0 mt-10 grid list-none gap-0 border-2 border-ink p-0 lg:grid-cols-3">
        <li v-for="(post, i) in latest" :key="post._path" v-reveal class="border-ink not-last:border-b-2 lg:not-last:border-b-0 lg:not-last:border-r-2">
          <NuxtLink :to="localePath(`/blog/${post.slug}`)" class="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-indigo-600">
            <div class="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-dim">
              <span class="text-yellow">{{ pad(i) }}</span>
              <span>{{ post.publishDate }} · {{ post.lang === "en" ? "EN" : "ES" }}</span>
            </div>
            <h3 class="m-0 font-display text-xl font-extrabold uppercase leading-tight text-slate-50 group-hover:text-yellow">{{ post.title }}</h3>
            <p class="m-0 line-clamp-4 text-sm leading-relaxed text-slate-300">{{ post.description }}</p>
            <span class="mt-auto pt-2 font-mono text-sm text-yellow transition-transform group-hover:translate-x-1">{{ $t("blog.open") }} →</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
