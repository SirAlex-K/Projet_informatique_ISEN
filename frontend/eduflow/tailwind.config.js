/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#6c63ff',
        'dark-bg': '#0d1117',
        'dark-surface': '#161b27',
      },
    },
  },
  plugins: [],
};
