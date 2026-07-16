/**
 * Function/File Length Rule Scope
 *
 * `files`/`ignores` scope shared by the strict (error-level)
 * `max-lines-per-function`/`max-lines` block in `configs/overrides.js` and the
 * `recommended` preset's warn-level equivalent (`exports/recommended.js`).
 * Extracted to its own module so the two can never drift apart — the preset
 * only needs to relax the *severity*, not widen or narrow which files the
 * rules apply to (tests, stories, config files, and this package's own
 * `index.js` stay exempt either way).
 */

export const lengthRuleFileMatch = {
  files: ['**/*.{ts,tsx,js,jsx}'],
  ignores: [
    '**/*.stories.{js,jsx,ts,tsx}',
    '**/*.test.{js,jsx,ts,tsx}',
    '**/*.spec.{js,jsx,ts,tsx}',
    '**/test/**/*.{js,jsx,ts,tsx}',
    '**/tests/**/*.{js,jsx,ts,tsx}',
    '**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/configs/**/*.{js,ts}',
    '*.config.{js,ts}',
    'eslint.config.{js,ts}',
    'index.js',
  ],
}
