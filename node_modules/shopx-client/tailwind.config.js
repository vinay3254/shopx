/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#241e18",
        graphite: "#3a332d",
        cream: "#fff7eb",
        linen: "#f6ead9",
        amberx: "#f4a51c",
        tealx: "#0f766e",
        clay: "#c66f43"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Aptos", "Trebuchet MS", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(36, 30, 24, 0.12)",
        card: "0 10px 28px rgba(36, 30, 24, 0.08)"
      }
    }
  },
  plugins: []
};
