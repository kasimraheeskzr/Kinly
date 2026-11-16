/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kinly: {
          green: '#39765C',
          dark: '#21352D',
          muted: '#748078',
          bg: '#F6F7F5',
          card: '#FFFFFF',
          border: '#E7EBE5',
          tint: '#EDF4EE',
          tab: '#EDEFE9',
          promo: '#F4F5EB',
          bar: '#C6D9C8',
          coral: '#BD725E',
          olive: '#71874D',
          gold: '#AA8345',
          hoverGreen: '#2e614c'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'kinly': '0 1px 3px 0 rgba(33, 53, 45, 0.04), 0 1px 2px -1px rgba(33, 53, 45, 0.04)',
        'kinly-lg': '0 10px 25px -5px rgba(33, 53, 45, 0.08), 0 8px 10px -6px rgba(33, 53, 45, 0.04)'
      }
    },
  },
  plugins: [],
}