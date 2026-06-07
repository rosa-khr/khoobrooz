import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B1F3A",
        accent: "#F4B23E",
        orange: "#F97316",
        secondary: "#0F766E",
        surface: "#FFFFFF",
        background: "#F7F8FA",
        text: "#1F2937",
        muted: "#667085",
        line: "#D9DEE7"
      },
      borderRadius: {
        khoobrooz: "8px"
      },
      fontFamily: {
        sans: ["Dana", "IRANSans", "Vazirmatn", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(11, 31, 58, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
