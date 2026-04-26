import config from './index.js'

export default [
  {
    ignores: ['**/*.json', 'dist/**', 'coverage/**'],
  },
  ...config,
]
