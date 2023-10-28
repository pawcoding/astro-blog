/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
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
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
  ],
};
