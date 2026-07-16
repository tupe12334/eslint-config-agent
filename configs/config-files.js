/**
 * Configuration for configuration files
 * Allows hardcoded values and default exports in config files
 *
 * The `*.config.*` and `eslint.config.*` globs are recursive (they are
 * prefixed with a globstar) so the relaxations also reach config files that
 * live below the repo root — e.g. `apps/web/vite.config.ts` or
 * `packages/ui/eslint.config.mjs` in a monorepo. Previously these used
 * root-only globs (`*.config.{...}`), so a nested `eslint.config.mjs` /
 * `vite.config.ts` silently escaped the config-file relaxations and got hit
 * with `default/no-localhost`, `default/no-hardcoded-urls`, `max-lines`, etc.
 * — the same asymmetry the `.mjs`/`.cjs` coverage fix addressed for the
 * JavaScript rule set. This now mirrors the recursive-glob convention every
 * other config block already uses.
 *
 * `index.js` is intentionally left root-scoped: broadening it to a recursive
 * glob would relax these rules for every barrel/entry file in a consumer's
 * source tree, masking real issues. Only files whose names mark them as
 * configuration (`*.config.*`, `eslint.config.*`) are matched recursively.
 */

export const configFilesConfig = [
  // Configuration files - allow hardcoded values for configuration purposes
  {
    files: [
      '**/*.config.{js,ts,mjs,cjs}',
      '**/eslint.config.{js,ts,mjs,cjs}',
      'index.js',
      '**/configs/**/*.{js,ts,mjs,cjs}',
    ],
    rules: {
      'default/no-localhost': 'off',
      'default/no-hardcoded-urls': 'off',
      'default/no-default-params': 'off', // Allow default parameters in config files
      'import/no-default-export': 'off', // Allow default exports in config files
      'max-lines-per-function': 'off', // Allow long functions in config files
      'max-lines': 'off', // Allow long files in config files
      'ddd/require-spec-file': 'off', // Config files don't need spec files
      'jsdoc/require-jsdoc': 'off', // Config files don't need JSDoc
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
    },
  },
]
