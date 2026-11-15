import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    // OpenNext output includes bundled dependencies, not application source.
    ".open-next/**",
    ".wrangler/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local/CI utility scripts are not part of the Next app (scripts/ was
    // historically gitignored, so eslint never scanned it):
    "scripts/**",
  ]),
]);

export default eslintConfig;
