module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        ecmaVersion: 2022,
        sourceType: "module"
    },
    plugins: ["@typescript-eslint", "unused-imports", "prettier"],
    extends: [
        "next/core-web-vitals",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended"
    ],
    rules: {
        // prettier formatting surfaced as ESLint errors
        "prettier/prettier": "error",

        // enforce TS consistency
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-floating-promises": "error",

        // clean imports
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
            "warn",
            { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }
        ],

        // good TS hygiene
        "prefer-const": "error",
        "no-console": ["warn", { allow: ["warn", "error", "info"] }]
    }
};
