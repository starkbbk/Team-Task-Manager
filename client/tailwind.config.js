/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff9f2',
          100: '#ffefdb',
          200: '#ffdbb3',
          300: '#ffbf7d',
          400: '#ff9d47',
          500: '#ff7e1a', // Main amber/orange accent
          600: '#f0670d',
          700: '#c74e0c',
          800: '#9e3f11',
          900: '#7f3612',
          950: '#451a07',
        },
        theme: {
          bg: '#f9f4ee', // Warm cream background
          sidebar: '#f3ece4',
          card: '#ffffff',
          text: {
            main: '#2d2d2d',
            muted: '#6b6b6b',
            light: '#949494',
          },
          border: 'rgba(255, 255, 255, 0.5)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
