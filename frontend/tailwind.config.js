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
          DEFAULT: '#E50914',
          dark: '#B20710',
          light: '#FF1F29',
          50: '#FFE5E7',
          100: '#FFCCCE',
          200: '#FF999D',
          300: '#FF666C',
          400: '#FF333B',
          500: '#E50914',
          600: '#B20710',
          700: '#8C0509',
          800: '#660407',
          900: '#330204',
        },
        dark: {
          DEFAULT: '#0a0a0a',
          lighter: '#1a1a1a',
          card: '#141414',
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#cccccc',
          300: '#999999',
          400: '#666666',
          500: '#333333',
          600: '#1a1a1a',
          700: '#141414',
          800: '#0f0f0f',
          900: '#0a0a0a',
        },
        accent: {
          purple: '#9333EA',
          blue: '#3B82F6',
          green: '#10B981',
          yellow: '#F59E0B',
          pink: '#EC4899',
        }
      },
      boxShadow: {
        'glow': '0 0 8px rgba(229, 9, 20, 0.25), 0 0 16px rgba(229, 9, 20, 0.1)',
        'glow-lg': '0 0 12px rgba(229, 9, 20, 0.3), 0 0 24px rgba(229, 9, 20, 0.15)',
        'glow-xl': '0 0 16px rgba(229, 9, 20, 0.35), 0 0 32px rgba(229, 9, 20, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'inner-glow': 'inset 0 0 12px rgba(229, 9, 20, 0.1)',
        'neon': '0 0 4px rgba(229, 9, 20, 0.4), 0 0 8px rgba(229, 9, 20, 0.3), 0 0 12px rgba(229, 9, 20, 0.2)',
        'depth': '0 10px 40px rgba(0, 0, 0, 0.5), 0 20px 80px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      backdropSaturate: {
        150: '1.5',
        200: '2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'gradient': 'gradient-shift 8s ease infinite',
        'slow-zoom': 'slow-zoom 25s ease-in-out infinite alternate',
        'rotate-slow': 'rotate-slow 20s linear infinite',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '2000': '2000ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'snappy': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '98': '0.98',
        '97': '0.97',
      },
      blur: {
        xs: '2px',
        '3xl': '64px',
        '4xl': '128px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
