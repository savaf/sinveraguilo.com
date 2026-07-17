import tailwindcss from "@tailwindcss/vite";

const isDev = process.env.NODE_ENV === "development";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  experimental: {
    viewTransition: true,
  },

  modules: ["@nuxt/image", "@nuxtjs/google-fonts", "nuxt-icon", "@nuxt/content", "@nuxtjs/i18n"],

  // No sourcemaps in production: speeds up the Nitro/Vite bundle and shrinks output.
  sourcemap: { server: false, client: false },

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    strategy: "no_prefix",
    defaultLocale: "en",
    locales: [
      { code: "en", language: "en-US", name: "English", file: "en.json" },
      { code: "es", language: "es-DO", name: "Español", file: "es.json" },
    ],
    langDir: "i18n/locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "sinver_lang",
      redirectOn: "root",
      alwaysRedirect: true,
    },
  },

  routeRules: {
    "/**": isDev
      ? {}
      : {
          // isr: 60,
          cache: {
            swr: true,
            maxAge: 120,
            staleMaxAge: 60,
            headersOnly: true,
          },
        },
    // "/": isDev
    //   ? {}
    //   : {
    //       prerender: true,
    //     },
    // "/api/*": isDev
    //   ? {}
    //   : {
    //       cache: { maxAge: 60 * 60 },
    //     },
  },

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
    // prerender: {
    //   crawlLinks: true,
    //   routes: ["/sitemap.xml", "/robots.txt"],
    // },
  },

  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: "123",
    isProd: import.meta.env.NODE_ENV === "production",
    // Keys within public are also exposed client-side
    public: {
      apiBase: "/api",
    },
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      title: "Sinver Aguiló",
      htmlAttrs: { lang: "en" },
      bodyAttrs: { class: "antialiased" },
      meta: [
        // SEO meta tags
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        // { name: "keywords", content: "" },
        { name: "format-detection", content: "telephone=no" },
        // { name: "description", content: "Hi, I'm Sinver Aguiló, web developer in Santo Domingo, República Dominicana." },

        // // Open Graph / Facebook
        // { property: "og:type", content: "website" },
        // { property: "og:url", content: "https://www.sinveraguilo.com" },
        // { property: "og:title", content: "Sinver Aguiló" },
        // { property: "og:description", content: "Hi, I'm Sinver Aguiló, web developer in Santo Domingo, República Dominicana." },
        // { property: "og:image", content: "/images/logo.png" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/images/logo.png",
        },
      ],
      script: [
        // { children: "window.$plausible = [];" },
        // {
        //   defer: true,
        //   src: "https://plausible.io/js/plausible.js",
        //   type: "text/partytown",
        //   "data-domain": "https://www.sinveraguilo.com",
        // },
      ],
    },
  },

  image: {
    format: ["webp"],
    // domains: isDev ? ["localhost"] : ["sinveraguilo.com"],
  },

  css: ["~/assets/styles/tailwind.css", "~/assets/styles/main.css"],
  components: true,

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      Archivo: [600, 700, 800, 900],
      "Space+Grotesk": [400, 500, 600, 700],
      "JetBrains+Mono": [400, 500, 700],
      "Flow+Circular": [400],
    },
    display: "swap",
    prefetch: true,
    preconnect: true,
    preload: true,
  },

  nuxtIcon: {
    size: "24px", // default <Icon> size applied
    class: "icon", // default <Icon> class applied
    aliases: {
      // 'nuxt': 'logos:nuxt-icon',
    },
  },

  device: {
    refreshOnResize: true,
  },

  content: {
    // ... options
  },

  compatibilityDate: "2026-07-14",
});