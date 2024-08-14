import type { Config } from "tailwindcss";
const { addDynamicIconSelectors } = require("@iconify/tailwind");

const config = {
  darkMode: ["selector"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
        },
        secondary: {
          DEFAULT: "#10b981",
          dark: "#059669",
        },
        background: {
          light: "#f3f4f6",
          dark: "#1f2937",
        },
        text: {
          light: "#1f2937",
          dark: "#f3f4f6",
        },
        accent: {
          light: "#6366f1",
          dark: "#4f46e5",
        },
        nodedark: "#1a1a1a",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), addDynamicIconSelectors()],
} satisfies Config;

export default config;