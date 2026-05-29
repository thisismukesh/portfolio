import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // dark base — deep cool charcoal, never pure black
        bg: "oklch(0.165 0.008 250)",
        "bg-2": "oklch(0.205 0.008 250)",
        "bg-panel": "oklch(0.215 0.008 250)",
        "bg-card": "oklch(0.235 0.008 250)",
        // off-white, slightly warm
        fg: "oklch(0.945 0.005 90)",
        "fg-2": "oklch(0.78 0.008 90)",
        "fg-3": "oklch(0.58 0.008 90)",
        "fg-4": "oklch(0.42 0.008 90)",
        hair: "oklch(0.32 0.008 250)",
        "hair-2": "oklch(0.27 0.008 250)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        block: "720px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(.3,.7,.4,1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up .28s cubic-bezier(.3,.7,.4,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
