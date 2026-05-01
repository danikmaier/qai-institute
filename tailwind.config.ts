import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        "off-white": "#F5F5F3",
        black: "#1A1A1A",
        teal: {
          DEFAULT: "#7C7C7C",
          dark: "#7C7C7C",
        },
        grey: {
          100: "#F5F5F3",
          200: "#E8E8E6",
          300: "#D1D1CF",
          400: "#A8A8A6",
          500: "#737371",
          600: "#4A4A48",
          700: "#2E2E2C",
        },
      },
      fontFamily: {
        sans: ["'Arial Unicode MS'", "Arial", "sans-serif"],
        serif: ["'Arial Unicode MS'", "Arial", "sans-serif"],
        mono: ["'Arial Unicode MS'", "Arial", "sans-serif"],
      },
      letterSpacing: {
        "widest-xl": "0.3em",
        "widest-2xl": "0.4em",
      },
      maxWidth: {
        prose: "680px",
        "8xl": "88rem",
      },
      animation: {
        "page-fade": "pageFade 0.4s ease-out both",
      },
      keyframes: {
        pageFade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
