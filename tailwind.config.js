/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B6B",
        "dark-100": "#1A1A1A",
        gray: {
          500: "#6B7280"
        }
      },
      fontFamily: {
        "quicksand": ["Quicksand-Regular"],
        "quicksand-bold": ["Quicksand-Bold"],
        "quicksand-light": ["Quicksand-Light"],
        "quicksand-medium": ["Quicksand-Medium"],
        "quicksand-semibold": ["Quicksand-SemiBold"],
      }
    },
  },
  plugins: [],
};