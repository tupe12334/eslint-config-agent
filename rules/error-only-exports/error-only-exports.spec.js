import { RuleTester } from 'eslint'
import { errorOnlyExportsRule } from './index.js'

/**
 * Test suite for the error-only-exports rule.
 *
 * The rule flags files whose ONLY exports are Error classes (a class whose
 * superclass is `Error` or whose name ends with `Error`). Such files do not
 * need a spec file, so the rule suggests adding the
 * `/* eslint-disable ddd/require-spec-file *\/` comment. A file that already
 * carries that disable comment, or that exports anything other than Error
 * classes, must NOT be flagged.
 */

const ruleTester = new RuleTester({
  // Register a stub `ddd/require-spec-file` rule so that the
  // `eslint-disable ddd/require-spec-file` directives used in the valid cases
  // resolve to a known rule instead of raising "Definition for rule ... was
  // not found" inside the isolated RuleTester environment.
  plugins: {
    ddd: {
      rules: {
        'require-spec-file': { create: () => ({}) },
      },
    },
  },
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

ruleTester.run('error-only-exports', errorOnlyExportsRule, {
  valid: [
    // No exports at all -> nothing to flag.
    '',
    'const internal = 1;\nfunction helper() {\n  return internal;\n}',
    // A regular (non-error) named export.
    'export const value = 1;',
    'export function doThing() {\n  return 1;\n}',
    // A class export that is not an Error class.
    'export class UserService {\n  run() {\n    return 1;\n}\n}',
    // Mixed: an Error class plus a non-error export disqualifies the file.
    'export class MyError extends Error {}\nexport const code = 1;',
    // Export specifiers are treated conservatively (not error-only).
    'class MyError extends Error {}\nexport { MyError };',
    // Already error-only but the disable comment is present.
    '/* eslint-disable ddd/require-spec-file */\nexport class MyError extends Error {}',
    '// eslint-disable-next-line ddd/require-spec-file\nexport class MyError extends Error {}',
  ],

  invalid: [
    // Named export of a class directly extending Error.
    {
      code: 'export class MyError extends Error {}',
      errors: [{ messageId: 'errorOnlyFile', type: 'Program' }],
    },
    // Named export of a class extending another *Error class.
    {
      code: 'export class ValidationError extends BaseError {}',
      errors: [{ messageId: 'errorOnlyFile', type: 'Program' }],
    },
    // Default export of an Error class.
    {
      code: 'export default class MyError extends Error {}',
      errors: [{ messageId: 'errorOnlyFile', type: 'Program' }],
    },
    // Multiple Error classes are still a single error-only file (one report).
    {
      code: 'export class AError extends Error {}\nexport class BError extends Error {}',
      errors: [{ messageId: 'errorOnlyFile', type: 'Program' }],
    },
  ],
})

console.log('✅ All error-only-exports tests passed!')
