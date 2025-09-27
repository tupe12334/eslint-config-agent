import { RuleTester } from "eslint";
import { selector, message } from "./index.js";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

// Create a mock rule for testing
const mockRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow empty export statements",
    },
    schema: [],
  },
  create(context) {
    return {
      [selector]: (node) => {
        context.report({
          node,
          message,
        });
      },
    };
  },
};

ruleTester.run("no-empty-exports", mockRule, {
  valid: [
    // Named exports with declarations
    'export const foo = 1;',
    'export function bar() {}',
    'export class Baz {}',

    // Default exports
    'const foo = 1; export default foo;',
    'export default function() {}',
    'export default class {}',

    // Re-exports from other modules (allowed)
    'export { } from "./other";',
    'export { foo } from "./other";',
    'export * from "./other";',
    'export * as namespace from "./other";',

    // Regular exports
    'export const Bar = {};',

    // No exports at all
    'const foo = 1;',
    'function bar() {}',
    'class Baz {}',

    // Named exports with local variables
    'const bar = 2; export const foo = 1;',
    'export const foo = 1; export const bar = 2;',
    'export const bar = 1;',
  ],
  invalid: [
    {
      code: 'export { };',
      errors: [{ message }],
    },
    {
      code: 'export {\n};',
      errors: [{ message }],
    },
    {
      code: 'export {  };',
      errors: [{ message }],
    },
    {
      code: `export {
      };`,
      errors: [{ message }],
    },
    {
      code: 'export { /* comment */ };',
      errors: [{ message }],
    },
    // Multiple empty exports
    {
      code: `export { };
export { };`,
      errors: [{ message }, { message }],
    },
    // Mixed with valid exports
    {
      code: `export const foo = 1;
export { };
export function bar() {}`,
      errors: [{ message }],
    },
  ],
});