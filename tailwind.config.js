/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#006655", // Mosque
        "primary-hover": "#005544",
        "primary-light": "#e6f0ee",
        "background-light": "#EEF6F6", // Clear Day
        "background-dark": "#0f2320",
        "nordic": "#19322F",
        "nordic-muted": "#5C706D",
        "mosque": "#006655",
        "hint-green": "#D9ECC8",
        "clear-day": "#EEF6F6",
        "clearday": "#EEF6F6",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "sf": ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "2xl": "1rem",
        "full": "9999px"
      },
      boxShadow: {
        "soft": "0 10px 40px -10px rgba(0,0,0,0.05)",
        "card": "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)"
      }
    },
  },
  plugins: [],
}
