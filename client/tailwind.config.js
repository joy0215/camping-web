/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Brand palette, taken from the logo: navy ink on warm paper.
      // `stone` and `orange` are re-mapped so every page shares the same tones.
      colors: {
        stone: {
          50: '#f7f3ed',
          100: '#eee8de',
          200: '#dfd7ca',
          300: '#c6bdae',
          400: '#99948a',
          500: '#6d6e6d',
          600: '#525966',
          700: '#3a4557',
          800: '#273549',
          900: '#1b2739',
          950: '#111a28',
        },
        orange: {
          50: '#f8f0e9',
          100: '#f0dfd1',
          200: '#e4c4ab',
          300: '#d6a583',
          400: '#c58861',
          500: '#b36c48',
          600: '#9b5636',
          700: '#7f452c',
          800: '#653726',
          900: '#4d2b1f',
        },
      },
      fontFamily: {
        serif: ['Newsreader', '"Noto Serif TC"', '"Frank Ruhl Libre"', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', '"Noto Sans TC"', 'Heebo', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
