module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    "eslint:recommended",
    "plugin:vue/recommended"
    // 'plugin:vue/essential',
    // '@vue/standard',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "comma-dangle": ["error", {
      "arrays": "ignore",
      "objects": "always",
      "imports": "always",
      "exports": "always",
      "functions": "ignore",
    }],
    semi: ["error", "always"],
    "space-before-function-paren": 0,
    "padded-blocks": ["error", {
      "classes": "always",
      "blocks": "never",
    }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
