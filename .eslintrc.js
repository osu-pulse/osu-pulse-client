process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
    extends: ['@antfu'],
    rules: {
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
    },
    ignorePatterns: [
        '*.yml',
        '*.js'
    ],
}
