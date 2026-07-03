/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#047857',
          dark: '#065F46',
          light: '#D1FAE5',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#FFF8E1',
        },
        warning: '#F59E0B',
        danger: '#DC2626',
        success: '#10B981',
        charcoal: '#1E293B',
        slate: '#334155',
        bg: '#F8FAFC',
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
}
