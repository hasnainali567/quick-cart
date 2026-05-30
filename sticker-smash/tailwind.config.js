/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#19183B",
        secondary: "#708993",
        accent: "#A1C2BD",
        secondaryAccent: "#E7F2EF",
      },
    },
  },
  plugins: [],
};
