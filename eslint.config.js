import config from './index.js'

export default [
  {
    ignores: [
      '**/*.json',
      '**/dist/**',
      '**/coverage/**',
      // Invalid-by-design fixture: it carries a Tailwind-only className that the
      // strict config must flag, so it cannot pass this repo's own lint. The
      // `test:recommended` script lints it directly against `index.js`.
      'test/recommended/sample.jsx',
    ],
  },
  ...config,
]
