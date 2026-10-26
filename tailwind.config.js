/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paytm: {
          navy: '#002970',
          blue: '#00BAF2',
          blueHover: '#009EDC',
          bg: '#F4F6F9',
          success: '#10B981',
          warning: '#F59E0B',
          slate: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 41, 112, 0.05)',
        'paytm-card': '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
        'paytm-header': '0 1px 3px 0 rgba(0, 41, 112, 0.1)',
        'paytm-modal': '0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
      },
      borderRadius: {
        'card': '8px',
      }
    },
  },
  plugins: [],
}

