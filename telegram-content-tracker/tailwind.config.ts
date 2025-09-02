import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: { extend: {
    colors: { bg: "#0b1220", card: "#111826", accent: "#22d3ee" },
    boxShadow: { soft: "0 10px 30px rgba(0,0,0,0.35)" }
  } },
  plugins: [],
};
export default config;