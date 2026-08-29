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
        background: "var(--background)",
        foreground: "var(--foreground)",
        compliant: "#10b981", // green-500
        warning: "#f59e0b", // amber-500
        danger: "#ef4444", // red-500
      },
      fontFamily: {
        sans: ['var(--font-cairo)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
