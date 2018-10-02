module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "comma-dangle": ["error", {
      "arrays": "ignore",
      "objects": "always",
      "imports": "never",
      "exports": "never",
      "functions": "ignore",
    }],
    "semi": 0,
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
