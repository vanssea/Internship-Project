/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 20px 80px rgba(15, 23, 42, 0.14)',
      },
      backgroundImage: {
        'book-grid': 'radial-gradient(circle at top, rgba(251, 191, 36, 0.18), transparent 32%), linear-gradient(180deg, rgba(2, 6, 23, 0.02), transparent)',
      },
    },
  },
  plugins: [],
};