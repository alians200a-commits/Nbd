/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nabdBg: '#070f1f',
        nabdDark: '#0b1729',
        nabdSurface: '#11223b',
        nabdSurface2: '#152b45',
        nabdStroke: '#28415b',
        nabdTxt: '#eaf8ff',
        nabdMuted: '#9ab1c5',
        nabdCyan: '#36e0dd',
        nabdTeal: '#6bf4c7',
        nabdAmber: '#f2c575',
        nabdRed: '#ff8195',
        nabdBlue: '#6698ff',
      },
      fontFamily: {
        arabic: ['Tahoma', '"Noto Sans Arabic"', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
