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
          DEFAULT: "#1A5C5A",
          dark: "#134644",
          light: "#2D7D7B",
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
        serif: ["var(--font-dm-serif)", "DM Serif Display", "Georgia", "serif"],
        sans: ["var(--font-libre-franklin)", "Libre Franklin", "system-ui", "sans-serif"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "38": "9.5rem",
        "42": "10.5rem",
        "46": "11.5rem",
        "50": "12.5rem",
        "54": "13.5rem",
        "58": "14.5rem",
        "62": "15.5rem",
        "66": "16.5rem",
        "70": "17.5rem",
        "74": "18.5rem",
        "78": "19.5rem",
        "82": "20.5rem",
        "86": "21.5rem",
        "90": "22.5rem",
        "94": "23.5rem",
        "98": "24.5rem",
        "102": "25.5rem",
        "128": "32rem",
        "160": "40rem",
        "192": "48rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      letterSpacing: {
        "widest-xl": "0.3em",
        "widest-2xl": "0.4em",
      },
      lineHeight: {
        "relaxed-xl": "1.9",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      backgroundImage: {
        "kazakh-pattern": "url('/pattern.svg')",
      },
    },
  },
  plugins: [],
};

export default config;
