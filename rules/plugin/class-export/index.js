/**
 * Rule configuration for eslint-plugin-class-export
 *
 * This plugin enforces consistent class export patterns to improve code organization
 * and import consistency across the codebase.
 *
 * @see https://www.npmjs.com/package/eslint-plugin-class-export
 */

export const classExportRules = {
  // Require named exports for classes instead of default exports
  'class-export/class-export': ['error', { require: 'named' }],
}
