import { RuleTester } from "eslint";
import { switchStatementsReturnTypeConfigs } from "./index.js";

/**
 * Test suite for switch-statements-return-type rules
 *
 * This tests the no-restricted-syntax configurations that enforce
 * explicit return type annotations for functions containing switch statements.
 */

// Create a single rule that tests all selectors
const switchStatementsReturnTypeRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Require explicit return type annotations for functions containing switch statements",
    },
    messages: {
      requireReturnType: "Functions containing switch statements must have explicit return type annotations.",
    },
    schema: [],
  },
  create(context) {
    const rules = {};

    // Add all selectors to the rule
    switchStatementsReturnTypeConfigs.forEach(config => {
      rules[config.selector] = function(node) {
        context.report({
          node,
          messageId: "requireReturnType",
        });
      };
    });

    return rules;
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
      project: null,
    },
  },
});

ruleTester.run("switch-statements-return-type", switchStatementsReturnTypeRule, {
  valid: [
    // Valid: Functions with switch statements that have return type annotations
    {
      code: `
        function processAction(action): string {
          switch (action.type) {
            case 'increment':
              return 'incremented';
            case 'decrement':
              return 'decremented';
          }
        }
      `,
      name: "function declaration with return type",
      filename: "test.ts",
    },
    {
      code: `
        const handleValue = (value): string => {
          switch (typeof value) {
            case 'string':
              return value.toUpperCase();
            case 'number':
              return value.toString();
          }
        };
      `,
      name: "arrow function with return type",
      filename: "test.ts",
    },
    {
      code: `
        const processor = function(data): number {
          switch (data.operation) {
            case 'add':
              return data.a + data.b;
            case 'multiply':
              return data.a * data.b;
          }
        };
      `,
      name: "function expression with return type",
      filename: "test.ts",
    },

    // Valid: Functions without switch statements don't need return types
    {
      code: `
        function simpleFunction(x) {
          return x + 1;
        }
      `,
      name: "function without switch statement",
      filename: "test.ts",
    },
    {
      code: `
        const simpleArrow = (x) => x * 2;
      `,
      name: "arrow function without switch statement",
      filename: "test.ts",
    },
  ],

  invalid: [
    // Invalid: Function declarations with switch statements missing return type
    {
      code: `
        function processAction(action) {
          switch (action.type) {
            case 'increment':
              return 'incremented';
            case 'decrement':
              return 'decremented';
          }
        }
      `,
      errors: [{ messageId: "requireReturnType" }],
      name: "function declaration without return type",
      filename: "test.ts",
    },

    // Invalid: Arrow functions with switch statements missing return type
    {
      code: `
        const handleValue = (value) => {
          switch (typeof value) {
            case 'string':
              return value.toUpperCase();
            case 'number':
              return value.toString();
          }
        };
      `,
      errors: [{ messageId: "requireReturnType" }],
      name: "arrow function without return type",
      filename: "test.ts",
    },

    // Invalid: Function expressions with switch statements missing return type
    {
      code: `
        const processor = function(data) {
          switch (data.operation) {
            case 'add':
              return data.a + data.b;
            case 'multiply':
              return data.a * data.b;
          }
        };
      `,
      errors: [{ messageId: "requireReturnType" }],
      name: "function expression without return type",
      filename: "test.ts",
    },

    // Invalid: Nested function with switch statement
    {
      code: `
        function outerFunction(): void {
          function innerFunction(type) {
            switch (type) {
              case 'a':
                return 'Alpha';
              case 'b':
                return 'Beta';
            }
          }
        }
      `,
      errors: [{ messageId: "requireReturnType" }],
      name: "nested function without return type",
      filename: "test.ts",
    },
  ],
});

console.log("✅ All switch-statements-return-type tests passed!");
switchStatementsReturnTypeConfigs.forEach((config, index) => {
  console.log(`   Rule ${index + 1}:`);
  console.log(`     Selector: ${config.selector}`);
  console.log(`     Message: ${config.message}`);
});

export { switchStatementsReturnTypeRule };