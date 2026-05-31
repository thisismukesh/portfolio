import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [
      "design-reference/**",
      ".next/**",
      "node_modules/**",
    ],
  },
  ...nextCoreWebVitals,
];

export default config;
