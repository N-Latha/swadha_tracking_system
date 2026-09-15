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
          50: '#fef3ec',
          100: '#fde4d4',
          500: '#F26F2B',
          600: '#D85A1C',
          700: '#b84a16',
        },
        swadha: {
          orange: '#F26F2B',
          orangeDark: '#D85A1C',
          green: '#87C54B',
          greenDark: '#6EAB38',
          blue: '#2EA3F2',
          dark: '#2F2F2F',
          gray: '#666666',
          light: '#F2F2F2',
        }
      },
      fontFamily: {
        sans: ['"Open Sans"', 'Arial', 'sans-serif'],
        heading: ['Poppins', '"Open Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
