import { RuleTester } from "eslint";
import { noNullishCoalescingConfig } from "./index.js";

/**
 * Test suite for no-nullish-coalescing rule
 *
 * This tests the no-restricted-syntax configuration that prevents
 * the nullish coalescing operator (??) in favor of explicit null/undefined checks.
 */

// Create a custom rule for testing our selector
const noNullishCoalescingRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow nullish coalescing operator (??)",
    },
    messages: {
      noNullishCoalescing: noNullishCoalescingConfig.message,
    },
    schema: [],
  },
  create(context) {
    return {
      [noNullishCoalescingConfig.selector](node) {
        context.report({
          node,
          messageId: "noNullishCoalescing",
        });
      },
    };
  },
};

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    parser: (await import("@typescript-eslint/parser")).default,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run("no-nullish-coalescing", noNullishCoalescingRule, {
  valid: [
    // Valid: Explicit null checks with ternary operator
    {
      code: "const result = value !== null && value !== undefined ? value : 'default';",
      name: "explicit null and undefined check",
    },
    {
      code: "const name = user.name !== undefined ? user.name : 'Anonymous';",
      name: "explicit undefined check",
    },
    {
      code: "const config = input !== null ? input : 'fallback';",
      name: "explicit null check",
    },

    // Valid: Using logical OR operator (different behavior than ??)
    {
      code: "const port = process.env.PORT || 3000;",
      name: "logical OR for falsy values",
    },
    {
      code: "const result = getValue() || 'default';",
      name: "logical OR with function call",
    },

    // Valid: Conditional statements
    {
      code: `
        let result;
        if (value !== null && value !== undefined) {
          result = value;
        } else {
          result = 'default';
        }
      `,
      name: "if statement with explicit checks",
    },

    // Valid: Early returns
    {
      code: `
        function getDisplayName(name) {
          if (name !== null && name !== undefined) {
            return name;
          }
          return 'Unknown';
        }
      `,
      name: "early return with explicit checks",
    },

    // Valid: Helper functions
    {
      code: `
        function isNullOrUndefined(value) {
          return value === null || value === undefined;
        }
        const result = isNullOrUndefined(input) ? 'default' : input;
      `,
      name: "using helper function for null checks",
    },

    // Valid: Object.hasOwnProperty and similar patterns
    {
      code: "const value = 'key' in obj && obj.key !== null ? obj.key : 'default';",
      name: "property existence check with null check",
    },

    // Valid: Array access with bounds checking
    {
      code: "const item = arr.length > 0 && arr[0] !== null ? arr[0] : null;",
      name: "safe array access with null check",
    },
  ],

  invalid: [
    // Invalid: Basic nullish coalescing usage
    {
      code: "const result = value ?? 'default';",
      errors: [{ messageId: "noNullishCoalescing" }],
      name: "basic nullish coalescing",
    },
    {
      code: "const name = user.name ?? 'Anonymous';",
      errors: [{ messageId: "noNullishCoalescing" }],
      name: "property access with nullish coalescing",
    },

    // Invalid: Function call results
    {
      code: "const data = fetchData() ?? 'no data';",
      errors: [{ messageId: "noNullishCoalescing" }],
      name: "function call with nullish coalescing",
    },
    {
      code: "const result = getValue() ?? getDefaultValue();",
      errors: [{ messageId: "noNullishCoalescing" }],
      name: "function calls with nullish coalescing",
    },

    // Invalid: Chained nullish coalescing
    {
      code: "const result = a ?? b ?? c ?? 'final';",
      errors: [
        { messageId: "noNullishCoalescing" },
        { messageId: "noNullishCoalescing" },
        { messageId: "noNullishCoalescing" }
      ],
      name: "chained nullish coalescing operators",
    },

    // Invalid: In expressions
    {
      code: "const sum = (a ?? 0) + (b ?? 1);",
      errors: [
        { messageId: "noNullishCoalescing" },
        { messageId: "noNullishCoalescing" }
      ],
      name: "nullish coalescing in mathematical expressions",
    },

    // Invalid: In conditionals
    {
      code: "if (value ?? false) { console.log('truthy'); }",
      errors: [{ messageId: "noNullishCoalescing" }],
      name: "nullish coalescing in conditional",
    },

    // Invalid: In return statements
    {
      code: "function getConfig() { return config ?? defaultConfig; }",
      errors: [{ messageId: "noNullishCoalescing" }],
      name: "nullish coalescing in return statement",
    },

    // Invalid: In object properties
    {
      code: "const obj = { timeout: config.timeout ?? 5000 };",
      errors: [{ messageId: "noNullishCoalescing" }],
      name: "nullish coalescing in object property",
    },

    // Invalid: In array literals
    {
      code: "const items = [name ?? 'unknown', age ?? 0];",
      errors: [
        { messageId: "noNullishCoalescing" },
        { messageId: "noNullishCoalescing" }
      ],
      name: "nullish coalescing in array literals",
    },

    // Invalid: In template literals
    {
      code: "const message = `Hello, ${name ?? 'stranger'}!`;",
      errors: [{ messageId: "noNullishCoalescing" }],
      name: "nullish coalescing in template literal",
    },

    // Invalid: With async/await
    {
      code: "const result = await fetchData() ?? 'fallback';",
      errors: [{ messageId: "noNullishCoalescing" }],
      name: "nullish coalescing with async result",
    },

    // Invalid: Complex nested expressions
    {
      code: "const value = obj?.nested?.prop ?? obj?.fallback ?? 'default';",
      errors: [
        { messageId: "noNullishCoalescing" },
        { messageId: "noNullishCoalescing" }
      ],
      name: "nullish coalescing with optional chaining",
    },

    // Invalid: In JSX expressions
    {
      code: "const element = <div>{title ?? 'Default Title'}</div>;",
      errors: [{ messageId: "noNullishCoalescing" }],
      name: "nullish coalescing in JSX",
    },

    // Invalid: Assignment patterns
    {
      code: "let result; result = input ?? 'default';",
      errors: [{ messageId: "noNullishCoalescing" }],
      name: "nullish coalescing in assignment",
    },

    // Invalid: Function parameters
    {
      code: "function process(value = input ?? 'default') { }",
      errors: [{ messageId: "noNullishCoalescing" }],
      name: "nullish coalescing in default parameter",
    },
  ],
});

console.log("✅ All no-nullish-coalescing tests passed!");
console.log(`   Selector: ${noNullishCoalescingConfig.selector}`);
console.log(`   Message: ${noNullishCoalescingConfig.message}`);

export { noNullishCoalescingRule };