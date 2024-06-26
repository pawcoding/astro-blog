const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {
      blur: {
        xs: "2px",
      },
      height: {
        "screen-95": "95svh",
      },
      minHeight: {
        screen: "100svh",
      },
      margin: {
        "3/4": "0.1875rem",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(.4,1.75,.6,1)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
  ],
};
