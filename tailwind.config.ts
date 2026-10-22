import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F8F3EA",
        cream: "#F1E7D8",
        bark: "#2C1A12", // dark brown text
        cocoa: "#3A2115", // deep brown buttons
        ember: "#C86B32", // burnt orange accent
        "ember-dark": "#A4521F", // accessible orange for small text on light backgrounds
        sage: "#777A50", // muted autumn green
        "sage-dark": "#5C5F3B",
        sand: "#E5D7C5", // light beige borders
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(44, 26, 18, 0.04), 0 8px 24px -12px rgba(44, 26, 18, 0.12)",
        lift: "0 2px 4px rgba(44, 26, 18, 0.05), 0 18px 40px -18px rgba(44, 26, 18, 0.25)",
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
