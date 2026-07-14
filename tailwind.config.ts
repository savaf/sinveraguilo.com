/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import tailwindTypography from "@tailwindcss/typography";

const srcDir = "./";
export default <Partial<Config>>{
  darkMode: ["class"],
  content: [`${srcDir}/components/**/*.{vue,js,ts,jsx,tsx}`, `${srcDir}/layouts/**/*.vue`, `${srcDir}/pages/**/*.vue`, `${srcDir}/composables/**/*.{js,ts}`, `${srcDir}/plugins/**/*.{js,ts}`, `${srcDir}/utils/**/*.{js,ts}`, `${srcDir}/App.{js,ts,vue}`, `${srcDir}/app.{js,ts,vue}`, `${srcDir}/Error.{js,ts,vue}`, `${srcDir}/error.{js,ts,vue}`, `${srcDir}/app.config.{js,ts}`],
  theme: {
    extend: {
      colors: {
        "primary-light": "#F7F8FC",
        "secondary-light": "#FFFFFF",
        "ternary-light": "#f6f7f8",

        "primary-dark": "#0D2438",
        "secondary-dark": "#102D44",
        "ternary-dark": "#1E3851",

        primary: "#51ECF3",
        "primary-content": "#175255",

        // Neo-brutalist redesign palette
        ink: "#0a1420",
        grid: "#123049",
        surface: "#0a1c2e",
        "footer-dark": "#0a1626",
        cyan: "#22d3ee",
        yellow: "#facc15",
        indigo: "#6366f1",
        mint: "#34d399",
        muted: "#9fb3c4",
        dim: "#5c7386",
        "ink-text": "#0b1622",
      },
      container: {
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "5rem",
          xl: "6rem",
          "2xl": "8rem",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        display: ["Archivo", ...defaultTheme.fontFamily.sans],
        grotesk: ["Space Grotesk", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
        loading: ["Flow Circular", "cursive"],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 20s linear infinite",
      },
      // fontSize: {
      //   base: [
      //     "16px",
      //     {
      //       fontWeight: "400",
      //       lineHeight: "24px",
      //     },
      //   ],
      //   xs: "12px",
      //   sm: "14px",
      //   md: "16px",
      //   lg: "18px",
      //   xl: "20px",
      //   "display-xs": [
      //     "24px",
      //     {
      //       lineHeight: "32px",
      //     },
      //   ],
      //   "display-sm": [
      //     "30px",
      //     {
      //       lineHeight: "38px",
      //     },
      //   ],
      //   "display-md": [
      //     "36px",
      //     {
      //       lineHeight: "44px",
      //       letterSpacing: "-0.72px",
      //     },
      //   ],
      //   "display-lg": [
      //     "48px",
      //     {
      //       lineHeight: "60px",
      //       letterSpacing: "-0.96px",
      //     },
      //   ],
      //   "display-xl": [
      //     "60px",
      //     {
      //       lineHeight: "72px",
      //       letterSpacing: "-1.2px",
      //     },
      //   ],
      //   "display-2xl": [
      //     "72px",
      //     {
      //       lineHeight: "90px",
      //       letterSpacing: "-1.44px",
      //     },
      //   ],
      // },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
      },
    },
  },
  plugins: [tailwindTypography],
};
