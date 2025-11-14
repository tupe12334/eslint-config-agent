import { noExplicitAnyConfig } from './no-explicit-any/index.js'

export const typescriptEslintRules = {
  ...noExplicitAnyConfig,
  '@typescript-eslint/consistent-type-assertions': 'off',
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
}
