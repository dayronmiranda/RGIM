// tailwind.config.js
module.exports = {
  content: [
    './*.html',
    './*.js',
    './old site/**/*.html',
    './old site/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5faff',
          100: '#e0f2ff',
          200: '#b9e6ff',
          300: '#7fd4ff',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      }
    }
  },
  plugins: [],
};
