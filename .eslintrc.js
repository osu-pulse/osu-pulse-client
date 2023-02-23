process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
  extends: ['@antfu'],
  rules: {
    '@typescript-eslint/unbound-method': 'off',
  },
}
