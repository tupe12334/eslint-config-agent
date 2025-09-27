import { RuleTester } from "@typescript-eslint/rule-tester";
import { switchStatementsReturnTypeConfigs } from "./index.js";

/**
 * Test suite for switch-statements-return-type rules
 *
 * This uses the modern 2024 approach with @typescript-eslint/rule-tester v8
 * and ESLint v9 flat config for testing TypeScript ESLint rules.
 */

// Custom error class for test failures
export class TestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TestError';
  }
}

// Configure RuleTester for Node.js test environment (modern best practice)
RuleTester.afterAll = () => {}; // No cleanup needed for simple tests
RuleTester.describe = (name, fn) => {
  console.log(`\n📝 ${name}`);
  fn();
};
RuleTester.it = (name, fn) => {
  try {
    fn();
    console.log(`   ✅ ${name}`);
  } catch (error) {
    console.log(`   ❌ ${name}: ${error.message}`);
    throw new TestError(error.message || 'Test failed');
  }
};
RuleTester.itOnly = RuleTester.it;

// Create a single rule that tests all selectors
const switchStatementsReturnTypeRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Require explicit return type annotations for functions containing switch statements",
      recommended: "strict",
    },
    messages: {
      requireReturnType: "Functions containing switch statements must have explicit return type annotations.",
    },
    schema: [],
    fixable: null,
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

// Modern ESLint v9 + typescript-eslint v8 configuration
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
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

console.log("\n✅ All switch-statements-return-type RuleTester tests completed!");
console.log("\n🎯 Modern Testing Benefits:");
console.log("   • Uses @typescript-eslint/rule-tester v8 (latest)");
console.log("   • ESLint v9 flat config compatibility");
console.log("   • Automatic TypeScript parser handling");
console.log("   • Enhanced error reporting and type safety");
console.log("   • No manual parser configuration required");

console.log(`\n📋 Tested ${switchStatementsReturnTypeConfigs.length} rule configurations:`);
switchStatementsReturnTypeConfigs.forEach((config, index) => {
  console.log(`   ${index + 1}. ${config.selector}`);
  console.log(`      → ${config.message}`);
});

