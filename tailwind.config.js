// tailwind.config.js

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // PRIMARIO — BASIL (frescura, “food fresh”)
        primary: {
          50: "#EEF7F0",
          100: "#DBEEDF",
          200: "#BFE0C5",
          300: "#9DD2A6",
          400: "#77C487",
          500: "#52B86D",
          600: "#3F9E59",
          700: "#2F7D45",
          800: "#265F37",
          900: "#1F4B2C",
        },

        // SECUNDARIO — MIDNIGHT TEAL (oscuro, elegante, no negro)
        secondary: {
          50: "#EAF4F5",
          100: "#D2E7E9",
          200: "#A9D1D5",
          300: "#7FBAC0",
          400: "#54A2AA",
          500: "#358C95",
          600: "#227079",
          700: "#195A62",
          800: "#0F424A",
          900: "#072A2D",
        },

        // ACENTOS (opcional, para estados y highlights “food”)
        accent: {
          // Guava/coral apetitoso
          50: "#FFEFF0",
          100: "#FFD9DC",
          200: "#FFB3B8",
          300: "#FF8D95",
          400: "#FF767F",
          500: "#FF6B6B",
          600: "#EE5D5D",
          700: "#D84C4C",
          800: "#B53C3C",
          900: "#8F3030",
        },
        warning: {
          // Saffron (miel/azafrán)
          50: "#FFF7E5",
          100: "#FFEDC2",
          200: "#FFE08F",
          300: "#FFD160",
          400: "#FFC23C",
          500: "#F0AF2F",
          600: "#D9971E",
          700: "#B87E16",
          800: "#926412",
          900: "#734E0E",
        },
        error: {
          // Tomato
          50: "#FFEDEA",
          100: "#FFD2CB",
          200: "#FFAA9E",
          300: "#FF8779",
          400: "#F36A5B",
          500: "#E4573D",
          600: "#CC4C34",
          700: "#A53E2A",
          800: "#833122",
          900: "#66271B",
        },

        // NEUTROS “comestibles”
        base: {
          // Oat: fondos/superficies cálidas
          50: "#FCF9F4",
          100: "#F7F2EA",
          200: "#EFE6D8",
          300: "#E3D6C1",
          400: "#D6C5A9",
          500: "#C7B392",
          600: "#A69176",
          700: "#88765F",
          800: "#6B5C4B",
          900: "#54493B",
        },
        neutral: {
          // Cacao: texto/contornos
          50: "#F6F1EE",
          100: "#EBDDD6",
          200: "#D8C1B6",
          300: "#C3A491",
          400: "#A7816B",
          500: "#8A644F",
          600: "#6F5040",
          700: "#593F33",
          800: "#463229",
          900: "#372720",
        },
        white: "#f2f2f2",
        black: {
          50: "#F5F5F6",
          100: "#E6E7E9",
          200: "#C9CCD1",
          300: "#A8ADB5",
          400: "#7D848C",
          500: "#5A5F66",
          600: "#3F4349",
          700: "#2C2F33",
          800: "#1F2124",
          900: "#141517",
          950: "#0B0C0D",
        },
      },
      fontFamily: {
        normal: ["PlusJakartaSansNormal", "sans-serif"],
        bold: ["PlusJakartaSansBold", "sans-serif"],
        medium: ["PlusJakartaSansMedium", "sans-serif"],
        semiBold: ["PlusJakartaSansSemiBold", "sans-serif"],
        extraBold: ["PlusJakartaSansExtraBold", "sans-serif"],
        black: ["PlusJakartaSansBlack", "sans-serif"],
        light: ["PlusJakartaSansLight", "sans-serif"],
        extraLight: ["PlusJakartaSansExtraLight", "sans-serif"],
        thin: ["PlusJakartaSansThin", "sans-serif"],
      },
    },
  },
  plugins: [],
};
