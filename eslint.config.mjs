import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import eslintPluginPerfectionist from "eslint-plugin-perfectionist";
import tseslint from "typescript-eslint";

// Astro plain <script> blocks (no attributes) are TypeScript by default — Astro docs:
// "All scripts are TypeScript by default" and "lang='ts'" triggers is:inline behavior.
// astro-eslint-parser creates *.astro/*.js virtual files for these blocks, but
// @typescript-eslint/parser uses ScriptKind.JS for .js files, rejecting TS generics.
// This wrapper renames the virtual filePath to .ts before forwarding to the real parser.
const astroScriptParser = {
  meta: tseslint.parser.meta,
  parse(code, options) {
    return tseslint.parser.parse(code, {
      ...options,
      filePath: options?.filePath?.replace(/\.js$/, ".ts"),
    });
  },
  parseForESLint(code, options) {
    return tseslint.parser.parseForESLint(code, {
      ...options,
      filePath: options?.filePath?.replace(/\.js$/, ".ts"),
    });
  },
};

const unusedVarsRule = [
  "error",
  { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_", varsIgnorePattern: "^_" },
];

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.wrangler/**",
      "apps/web/.astro/**",
      "apps/web/public/sw.js",
      "bun.lock",
    ],
  },

  // TypeScript — all packages
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
      "@typescript-eslint/no-empty-object-type": [
        "error",
        { allowInterfaces: "with-single-extends" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": unusedVarsRule,
    },
  },

  // Astro (apps/web only) — flat/recommended sets up astro-eslint-parser
  ...eslintPluginAstro.configs["flat/recommended"],
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        // TypeScript parser for Astro frontmatter (---) sections
        parser: tseslint.parser,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": unusedVarsRule,
    },
  },
  // Virtual *.astro/*.js files: plain <script> blocks extracted by astro-eslint-parser.
  // Use the wrapper parser so TypeScript generics parse correctly.
  {
    files: ["**/*.astro/*.js", "*.astro/*.js"],
    languageOptions: {
      parser: astroScriptParser,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": unusedVarsRule,
    },
  },

  // JSON files
  ...eslintPluginJsonc.configs["flat/recommended-with-jsonc"],

  // Perfectionist — consistent ordering of imports, interface members, enums, object keys
  eslintPluginPerfectionist.configs["recommended-natural"],

  // Declaration files: inline import() types are required in declare module blocks
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "off",
    },
  },

  // Prettier compat — must be last (disables formatting rules)
  eslintConfigPrettier,
);
