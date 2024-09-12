import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8EBEE",
        foreground: "161616",
        primary: "#0C3934",
        secondary: "#3D615D",
        stroke: "#B4C2C0",
        lightText: "#647372",
      },
      fontFamily: {
        cabinetGrotesk: ['var(--font-cabinet-grotesk)'],
      },
    },
  },
  plugins: [],
};
export default config;
