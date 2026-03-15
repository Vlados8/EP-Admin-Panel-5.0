/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'construction-bg': "url('/construction-bg.png')",
      },
    },
  },
  plugins: [],
}

