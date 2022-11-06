const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/*.{html,js,ts,tsx}", "./test/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Work Sans", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {},
  plugins: [],
};
