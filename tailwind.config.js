const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    // ...
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#1a1a1a",
      white: "#ffffff",
      gray: colors.gray,
      neutral: colors.neutral,
      success: {
        100: "#DDFDD8",
        200: "#B5FCB2",
        300: "#8AF790",
        400: "#6BEF7F",
        500: "#3DE567",
        600: "#2CC461",
        700: "#1EA45A",
        800: "#138450",
        900: "#0B6D4A",
      },
      primary: {
        100: "#CBDFFE",
        200: "#98BDFE",
        300: "#6598FE",
        400: "#3F79FE",
        500: "#0046FE",
        600: "#0035DA",
        700: "#0027B6",
        800: "#001C93",
        900: "#001379",
      },
      warning: {
        100: "#FFF4D0",
        200: "#FFE6A1",
        300: "#FFD472",
        400: "#FFC24E",
        500: "#FFA514",
        600: "#DB840E",
        700: "#B7670A",
        800: "#934D06",
        900: "#7A3A03",
      },
      danger: {
        100: "#FEE5D5",
        200: "#FDC4AC",
        300: "#FB9C82",
        400: "#F87662",
        500: "#F43A30",
        600: "#D12328",
        700: "#AF1829",
        800: "#8D0F28",
        900: "#750927",
      },
      info: {
        100: "#D5FDF9",
        200: "#ACFCF9",
        300: "#82F4F8",
        400: "#61E1F1",
        500: "#30C6E8",
        600: "#239CC7",
        700: "#1877A7",
        800: "#0F5586",
        900: "#093D6F",
      },
    },
  },
  darkMode: "class",
  plugins: [
    require('tailwindcss-react-aria-components'),
    require("tailwindcss-animate"),
  ],
};
