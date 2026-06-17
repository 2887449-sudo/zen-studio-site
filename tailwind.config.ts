import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5F2EC",
        ink: "#111111",
        muted: "#6F6A64",
        line: "#D9D1C6",
        ember: "#E85C1A",
        night: "#0A0A0A"
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
        display: ["Manrope", "Inter", "Arial", "sans-serif"]
      },
      letterSpacing: {
        studio: "0.12em"
      }
    }
  },
  plugins: []
};

export default config;
