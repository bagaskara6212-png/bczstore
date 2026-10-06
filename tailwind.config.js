/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        bcz: {
          950: "#07090f",
          900: "#0b0f18",
          800: "#111827",
          700: "#1b2535",
          500: "#ef4444"
        }
      },
      boxShadow: {
        glow: "0 0 35px rgba(239, 68, 68, .16)"
      }
    }
  },
  plugins: []
};