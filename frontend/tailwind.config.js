/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#13131b",
        surface: "#13131b",
        "surface-container": "#1f1f28",
        "surface-container-high": "#292933",
        "surface-container-highest": "#34343e",
        "surface-container-lowest": "#0d0d16",
        primary: "#ffb4a7",
        "primary-container": "#ff553d",
        "on-primary": "#670400",
        "on-surface": "#e4e1ee",
        "on-surface-variant": "#eabcb4",
        outline: "#b08780",
        racing: "#e10600",
      },
      fontFamily: {
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
