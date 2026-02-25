/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        snapchat: {
          yellow: '#FFFC00',
          blue: '#00B9FF',
          red: '#FF0000',
          green: '#00FF00',
          purple: '#9B51E0',
        },
      },
      fontFamily: {
        avenir: ['Avenir', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
