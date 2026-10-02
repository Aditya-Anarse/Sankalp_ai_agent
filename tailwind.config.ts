import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#05060A",
          secondary: "#080A10",
          tertiary: "#0B0E14",
          card: "rgba(255, 255, 255, 0.03)",
          "card-hover": "rgba(255, 255, 255, 0.06)",
        },
        glass: {
          border: "rgba(255, 255, 255, 0.09)",
          "border-hover": "rgba(255, 255, 255, 0.2)",
          surface: "rgba(255, 255, 255, 0.04)",
          highlight: "rgba(255, 255, 255, 0.12)",
        },
        brand: {
          cyan: "#00F0FF",
          sky: "#38BDF8",
          blue: "#3B82F6",
          indigo: "#6366F1",
          violet: "#8B5CF6",
          purple: "#A855F7",
          emerald: "#10B981",
        },
        foreground: {
          DEFAULT: "#F8FAFC",
          muted: "#94A3B8",
          subtle: "#64748B",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "glass-radial": "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)",
        "cyan-glow": "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
        "violet-glow": "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
      },
      boxShadow: {
        "glass-sm": "0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        "glass-md": "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        "glass-lg": "0 16px 48px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
        "glow-cyan": "0 0 35px -5px rgba(0, 240, 255, 0.3)",
        "glow-violet": "0 0 35px -5px rgba(139, 92, 246, 0.3)",
        "inner-glow": "inset 0 0 20px rgba(255, 255, 255, 0.05)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "float-reverse": "floatReverse 7s ease-in-out infinite",
        "orbit-fast": "orbit 12s linear infinite",
        "orbit-slow": "orbit 24s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        floatReverse: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(10px)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(120px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(120px) rotate(-360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
