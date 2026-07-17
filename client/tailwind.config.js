/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'brand-red': {
          DEFAULT: '#C91F26',
          dark: '#A3161C',
          light: '#E6484F',
        },
        'brand-black': '#101114',
        'brand-charcoal': '#181A1F',
        'brand-grey': '#24262B',
        'brand-gold': {
          DEFAULT: '#F5B700',
          dark: '#D99E00',
        },
        'surface-light': '#F4F5F7',
        'border-light': '#E2E5E9',
        'text-muted': '#69707D',
        success: '#15803D',
        warning: '#B45309',
        error: '#B91C1C',
      },
      fontFamily: {
        heading: ['"Bebas Neue"', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      maxWidth: {
        content: '1320px',
      },
      borderRadius: {
        card: '1rem',
        button: '0.625rem',
      },
      spacing: {
        section: '5rem',
        'section-lg': '7rem',
      },
      boxShadow: {
        card: '0 4px 24px rgba(16, 17, 20, 0.08)',
        'card-hover': '0 8px 32px rgba(16, 17, 20, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
