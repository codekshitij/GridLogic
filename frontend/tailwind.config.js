/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "kido-dark": "#0b0c10",
        "kido-card": "#14171c",
        "f1-red": "#e10600",
      },
      fontFamily: {
        f1: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
