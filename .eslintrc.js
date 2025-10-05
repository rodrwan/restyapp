module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  rules: {
    // Reglas de React
    "react/react-in-jsx-scope": "off", // No necesario en React 17+
    "react/prop-types": "off", // Usamos TypeScript
    "react/display-name": "off",

    // Reglas generales
    "no-console": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "no-unused-vars": "off", // Deshabilitado para usar TypeScript
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  ignorePatterns: [
    "node_modules/",
    ".expo/",
    "dist/",
    "build/",
    "*.config.js",
    "*.config.ts",
    "android/",
    "ios/",
    "scripts/",
    ".eslintrc.js",
  ],
};
