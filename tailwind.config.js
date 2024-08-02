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
        '1/10': '10%',
        '2/10': '20%',
        '4/20': '40%',
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}

