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
        brand: {
          DEFAULT: "#ea580c",
          light: "#fed7aa",
          dark: "#c2410c",
          muted: "#9a3412",
        },
        zamow: {
          orange: "#ea580c",
          "orange-50": "#fff7ed",
          "orange-100": "#ffedd5",
          "orange-200": "#fed7aa",
          "orange-300": "#fdba74",
          "orange-400": "#fb923c",
          "orange-500": "#f97316",
          "orange-600": "#ea580c",
          cream: "#fffbeb",
          charcoal: "#1c1917",
          "charcoal-muted": "#57534e",
        },
        mauve: {
          DEFAULT: "oklch(71.1% 0.019 323.02)",
          light: "oklch(85% 0.015 323)",
          dark: "oklch(43.5% 0.029 321.78)",
          muted: "oklch(60% 0.02 323)",
        },
        /** Paleta ODART (zgodna z odart.pl/strony-internetowe — demo iframe) */
        odart: {
          accent: "#d95b3a",
        },
        beauty: {
          rose: "#D86786",
          hero: "#F6E7EB",
          charcoal: "#1E1E1E",
          "charcoal-muted": "#7A6A70",
          "pink-200": "#F8D9E0",
          "pink-300": "#E7A9B6",
          "pink-400": "#D86786",
          "pink-500": "#c45575",
        },
        wet: {
          teal: "#0d9488",
          "teal-50": "#f0fdfa",
          "teal-100": "#ccfbf1",
          "teal-200": "#99f6e4",
          "teal-600": "#0d9488",
          "teal-700": "#0f766e",
          "teal-800": "#115e59",
          mint: "#ecfdf5",
          navy: "#0f172a",
          "navy-muted": "#475569",
        },
        /** Paleta GabinetHarmonogram (dentysta.odart.pl i kolejne branże) */
        gab: {
          sky: "#0ea5e9",
          "sky-50": "#f0f9ff",
          "sky-100": "#e0f2fe",
          "sky-600": "#0284c7",
          navy: "#0c4a6e",
          "navy-muted": "#475569",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        instrument: ["var(--font-instrument)", "Georgia", "serif"],
        familjen: ["var(--font-familjen)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
