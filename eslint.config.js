import js from "@eslint/js";
import importX from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "build/",
      ".react-router/",
      "node_modules/",
      "coverage/",
      "playwright-report/",
      "test-results/",
      "drizzle/",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs.flat.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { "import-x": importX },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "import-x/no-duplicates": "error",
      // React Router's idiom is `throw new Response(...)` for HTTP errors.
      "@typescript-eslint/only-throw-error": [
        "error",
        { allow: [{ from: "lib", name: "Response" }] },
      ],
      // Feature modules expose a public API (index.ts) plus *.server.ts files.
      // Reaching into another module's internals breaks the boundary.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["~/features/*/components/*", "~/features/*/internal/*"],
              message:
                "Import from the feature's public index (~/features/<name>) instead of its internals.",
            },
          ],
        },
      ],
    },
  },
  {
    // Untyped plugins (jsx-a11y) make type-aware rules noisy in this file.
    files: ["eslint.config.js"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
