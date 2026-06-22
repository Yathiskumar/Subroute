import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // semantic surfaces
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        "surface-elevated": "hsl(var(--surface-elevated) / <alpha-value>)",
        "surface-sunken": "hsl(var(--surface-sunken) / <alpha-value>)",

        // text
        muted: "hsl(var(--muted) / <alpha-value>)",
        subtle: "hsl(var(--subtle) / <alpha-value>)",

        // borders
        border: "hsl(var(--border) / <alpha-value>)",
        "border-subtle": "hsl(var(--border-subtle) / <alpha-value>)",
        "border-strong": "hsl(var(--border-strong) / <alpha-value>)",

        // accents
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          muted: "hsl(var(--accent-muted) / <alpha-value>)",
        },
        secondary: "hsl(var(--secondary) / <alpha-value>)",

        // semantic
        success: "hsl(var(--success) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",
        danger: "hsl(var(--danger) / <alpha-value>)",
        info: "hsl(var(--info) / <alpha-value>)",

        // difficulty
        "diff-beginner": "hsl(var(--diff-beginner) / <alpha-value>)",
        "diff-intermediate": "hsl(var(--diff-intermediate) / <alpha-value>)",
        "diff-advanced": "hsl(var(--diff-advanced) / <alpha-value>)",
      },
      borderRadius: {
        xs: "0.25rem",
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.04em" }],
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(circle, hsl(var(--border) / 0.5) 1px, transparent 1px)",
        "grid-lines":
          "linear-gradient(to right, hsl(var(--border) / 0.25) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.25) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-grid": "20px 20px",
        "grid-lines": "40px 40px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "blink-caret": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "scan-line": "scan-line 2.5s ease-in-out infinite",
        "blink-caret": "blink-caret 1.1s steps(2) infinite",
      },
      boxShadow: {
        glow: "0 0 0 1px hsl(var(--accent) / 0.35), 0 0 24px -4px hsl(var(--accent) / 0.45)",
        card: "0 1px 0 0 hsl(var(--border-subtle)), 0 0 0 1px hsl(var(--border-subtle))",
        "card-hover":
          "0 1px 0 0 hsl(var(--border)), 0 0 0 1px hsl(var(--border)), 0 8px 24px -8px hsl(0 0% 0% / 0.3)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
