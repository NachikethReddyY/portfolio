import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Geist", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        ink: "#11120f",
        paper: "#f7f4ed",
        track: "#5271ff",
        signal: "#1f6f68",
        graphite: "#2a2c28",
      },
      boxShadow: {
        soft: "0 22px 60px rgba(17, 18, 15, 0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
