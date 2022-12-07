module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: "eslint:recommended",
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
    },
    rules: {
        eqeqeq: "error",
        "no-trailing-spaces": "error",
        "arrow-spacing": ["error", { before: true, after: true }],
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "never"],
    },
}
