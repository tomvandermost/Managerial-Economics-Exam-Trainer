import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f2a37",
        mist: "#eef3f0",
        sand: "#f6f3ec",
        pine: "#32584f",
        slate: "#5d6b75",
        accent: "#8e6f4c",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      boxShadow: {
        panel: "0 14px 40px rgba(28, 40, 38, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
