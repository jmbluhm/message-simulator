import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        party1: "#007AFF",
        party2: "#E5E5EA",
        party1Dark: "#0A84FF",
        party2Dark: "#3A3A3C",
      },
    },
  },
  plugins: [],
};
export default config;
