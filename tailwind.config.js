/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./rgim-website/public/**/*.html",
    "./rgim-website/src/**/*.{js,ts,jsx,tsx}",
    "./rgim-website/src/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      screens: {
        'xs': '375px',
        'mobile': '430px',
        'tablet': '768px',
        'desktop': '1024px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    }),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography')
  ],
  // Optimize for production
  corePlugins: {
    preflight: true,
  },
  // Purge unused styles in production
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './rgim-website/public/**/*.html',
      './rgim-website/src/**/*.{js,ts,jsx,tsx,html}'
    ],
    options: {
      safelist: [
        'active',
        'show',
        'hidden',
        'loading',
        'error',
        'success',
        // Mobile navigation classes
        'mobile-nav-overlay',
        'mobile-cart-modal',
        // Animation classes
        'animate-spin',
        'animate-pulse',
        'animate-bounce'
      ]
    }
  }
}