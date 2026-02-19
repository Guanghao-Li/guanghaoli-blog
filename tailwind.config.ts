import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: "hsl(var(--surface))", light: "hsl(var(--surface-light))" },
        surfaceDark: { DEFAULT: "hsl(var(--surface-dark))", elevated: "hsl(var(--surface-dark-elevated))" },
        accent: { DEFAULT: "hsl(var(--accent))", muted: "hsl(var(--accent-muted))" },
      },
      borderRadius: { "3xl": "1.5rem", "4xl": "2rem" },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
