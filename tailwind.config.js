/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  purge: {
    enabled: true,
    content: ["./public/**/*.{html,js}"],
  }
}

