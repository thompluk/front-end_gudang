const { nextui } = require("@nextui-org/react");
// import { nextui } from '@nextui-org/react'
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      width: {
        '1/20': '5%',
        '1/13': '7.6%',
        '1/10': '10%',
        '15/100' : '15%',
        '12/100': '12%',
        '2/10': '20%',
        '3/10': '30%',
        '4/20': '40%',
        '3/2': '150%'
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}

