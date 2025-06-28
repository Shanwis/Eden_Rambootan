/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./popup.html",
    "./dashboard.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#133931', // deep green
          dark: '#213c59',   // navy blue
          slate: '#435b75',  // slate blue
        },
        accent: {
          lime: '#dff46b',   // lime yellow
          orange: '#bd5033', // burnt orange
        },
        secondary: {
          sage: '#688865',    // sage green
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Raleway', 'Inter', 'system-ui', 'sans-serif'],
        freigeist: ['Freigeist', 'Raleway', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
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
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(14, 165, 233, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
} 