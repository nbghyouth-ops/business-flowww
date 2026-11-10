import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  // Keep the starter on the flat config export that actually runs under the pinned ESLint/Next toolchain.
  ...nextCoreWebVitals,
  {
    linterOptions: { reportUnusedDisableDirectives: "off" },
    rules: {
      // Download links point at /api/v1/* route handlers (file downloads), not Next.js pages; <Link> would be wrong.
      "@next/next/no-html-link-for-pages": "off",
      // React 19 compiler-era rules flag the app's standard fetch-on-mount hooks; tracked as warnings, not build blockers.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
