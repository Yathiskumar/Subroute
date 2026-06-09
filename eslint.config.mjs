import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextCoreWebVitals,
  {
    ignores: [".next/**", "node_modules/**", "public/prototypes/**"],
  },
  {
    rules: {
      "@next/next/no-img-element": "off",
      // Misfires on lucide-react's `const Icon = getIcon(name)` factory.
      "react-hooks/static-components": "off",
      // Hits the standard `useEffect(() => setMounted(true), [])` hydration pattern.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
