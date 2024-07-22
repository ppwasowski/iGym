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
        Navigation: '#1c1c1c', // Navigation
        background: '#232323', // Dark background
        Secondary: '#4B4B4B', // Light grey for secondary actions
        Text: '#FFFFFF', // Text and icon white
        TextSec: '#232323', //Text secondary
        Separator:'#2a2a2a' // Separator
      }
    },
  },
  plugins: [],
}

