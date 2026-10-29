/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1B7576",
        secondary: "#4BBC7F",
      },
      fontFamily: {
        sans: ["Poppins", "Arial", "sans-serif"],
      },
      fontSize: {
        base: "16px",
        sm: "16px",
      },
    },
  },
  plugins: [],
};
