module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: ['airbnb'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018
  },
  plugins: ['react'],
  rules: {
    'no-console': 'off',
    'comma-dangle': ['error', 'never'],
    'no-multi-assign': 'off',
    'arrow-parens': 'off',
    'implicit-arrow-linebreak': 'off',
    'consistent-return': 'off'
  }
};
