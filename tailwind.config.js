/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./screens/**/*.{js,ts,jsx,tsx}",
    ".{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        Primary: '#00C87C', // Primary action green
        Alter: '#ff9a03', // Secondary action orange
        SecAlter: '#a303ff', // Alternative action purple
        Navigation: '#1c1c1c', // Navigation
        background: '#232323', // Dark background
        Secondary: '#2e2e2e', // Light grey background
        Text: '#FFFFFF', // Text and icon white
        TextSec: '#232323', //Text secondary
        Separator:'#2a2a2a' // Separator
      }
    },
  },
  plugins: [],
}

