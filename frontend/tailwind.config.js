/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./src/**/*.{html,js,jsx,ts,tsx}", "./public/index.html" ],
  theme: {
    extend: {
      colors:{
        'primary':'#7CB9E8',
      },
    },
  },
  plugins: [],
}

