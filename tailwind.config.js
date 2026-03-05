/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        selam: {
          cyan: '#06b6d4',
          dark: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
