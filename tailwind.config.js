/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    './app/**/*.{js,ts,jsx,tsx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "hsl(250 100% 99%)",
            foreground: "hsl(250 20% 10%)",
            primary: {
              DEFAULT: "hsl(265 83% 45%)",
              foreground: "hsl(0 0% 100%)",
            },
            secondary: {
              DEFAULT: "hsl(250 30% 90%)",
              foreground: "hsl(250 60% 25%)",
            },
            muted: {
              DEFAULT: "hsl(250 20% 95%)",
              foreground: "hsl(250 10% 40%)",
            },
            accent: {
              DEFAULT: "hsl(280 75% 60%)",
              foreground: "hsl(0 0% 100%)",
            },
            destructive: {
              DEFAULT: "hsl(0 84% 60%)",
              foreground: "hsl(0 0% 100%)",
            },
            border: "hsl(250 30% 86%)",
            input: "hsl(250 30% 86%)",
            ring: "hsl(265 83% 45%)",
          },
        },
        dark: {
          colors: {
            background: "hsl(250 30% 10%)",
            foreground: "hsl(250 20% 90%)",
            primary: {
              DEFAULT: "hsl(265 83% 55%)",
              foreground: "hsl(0 0% 100%)",
            },
            secondary: {
              DEFAULT: "hsl(250 30% 20%)",
              foreground: "hsl(250 20% 90%)",
            },
            muted: {
              DEFAULT: "hsl(250 30% 25%)",
              foreground: "hsl(250 20% 70%)",
            },
            accent: {
              DEFAULT: "hsl(280 75% 50%)",
              foreground: "hsl(0 0% 100%)",
            },
            destructive: {
              DEFAULT: "hsl(0 62% 30%)",
              foreground: "hsl(0 0% 100%)",
            },
            border: "hsl(250 30% 30%)",
            input: "hsl(250 30% 30%)",
            ring: "hsl(265 83% 55%)",
          },
        },
      },
    }),
  ],
};