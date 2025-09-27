import { RuleTester } from "@typescript-eslint/rule-tester";
import { switchCaseFunctionsReturnTypeConfigs } from "./index.js";

/**
 * Test suite for switch-case-functions-return-type rules
 *
 * This uses the modern 2024 approach with @typescript-eslint/rule-tester v8
 * and ESLint v9 flat config for testing TypeScript ESLint rules.
 */

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
    throw error;
  }
};
RuleTester.itOnly = RuleTester.it;

// Modern ESLint v9 + typescript-eslint v8 configuration
// Parser is automatically handled by typescript-eslint
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

// Create individual rules for each selector configuration
const createSwitchCaseFunctionRule = (config) => ({
  meta: {
    type: "problem",
    docs: {
      description: "Require explicit return type annotations for functions defined within switch cases",
      recommended: "strict",
    },
    messages: {
      requireReturnType: config.message,
    },
    schema: [],
    fixable: null,
  },
  create(context) {
    return {
      [config.selector]: function(node) {
        context.report({
          node,
          messageId: "requireReturnType",
        });
      },
    };
  },
});

console.log("🧪 Testing switch-case-functions-return-type rules with modern RuleTester...");

// Test each rule configuration
switchCaseFunctionsReturnTypeConfigs.forEach((config, index) => {
  const rule = createSwitchCaseFunctionRule(config);
  const ruleName = `switch-case-functions-return-type-${index}`;

  const isArrowFunction = config.selector.includes("ArrowFunctionExpression");
  const isFunctionExpression = config.selector.includes("FunctionExpression") && !isArrowFunction;
  const isInBlockStatement = config.selector.includes("BlockStatement");

  console.log(`\n🔍 Rule ${index + 1}: ${config.selector}`);

  const testCases = {
    valid: [
      // Common valid case - no functions in switch
      {
        code: `
          function simpleSwitch(type: string) {
            switch (type) {
              case 'a':
                return 'Alpha';
              case 'b':
                return 'Beta';
            }
          }
        `,
        name: "switch without functions",
        filename: "test.ts",
      },

      // Functions outside switch cases (rule doesn't apply)
      {
        code: `
          function outsideFunction(value: string) {
            const helper = (x: unknown) => String(x); // Outside switch, rule doesn't apply
            switch (value) {
              case 'test':
                return helper(value);
            }
          }
        `,
        name: "function outside switch case",
        filename: "test.ts",
      },
    ],
    invalid: []
  };

  // Add specific test cases based on rule type
  if (isArrowFunction) {
    if (isInBlockStatement) {
      testCases.valid.push({
        code: `
          function processor(operation: string) {
            switch (operation) {
              case 'transform': {
                const transformer = (input: unknown): string => String(input);
                return transformer('test');
              }
            }
          }
        `,
        name: "arrow function in block statement with return type",
        filename: "test.ts",
      });

      testCases.invalid.push({
        code: `
          function processor(operation: string) {
            switch (operation) {
              case 'transform': {
                const transformer = (input: unknown) => String(input); // Missing return type
                return transformer('test');
              }
            }
          }
        `,
        errors: [{ messageId: "requireReturnType" }],
        name: "arrow function in block statement without return type",
        filename: "test.ts",
      });
    } else {
      testCases.valid.push({
        code: `
          function processor(operation: string) {
            switch (operation) {
              case 'transform':
                const transformer = (input: unknown): string => String(input);
                return transformer('test');
            }
          }
        `,
        name: "arrow function in switch case with return type",
        filename: "test.ts",
      });

      testCases.invalid.push({
        code: `
          function processor(operation: string) {
            switch (operation) {
              case 'transform':
                const transformer = (input: unknown) => String(input); // Missing return type
                return transformer('test');
            }
          }
        `,
        errors: [{ messageId: "requireReturnType" }],
        name: "arrow function in switch case without return type",
        filename: "test.ts",
      });
    }
  }

  if (isFunctionExpression) {
    if (isInBlockStatement) {
      testCases.valid.push({
        code: `
          function processor(operation: string) {
            switch (operation) {
              case 'process': {
                const processor = function(input: unknown): string {
                  return String(input);
                };
                return processor('test');
              }
            }
          }
        `,
        name: "function expression in block statement with return type",
        filename: "test.ts",
      });

      testCases.invalid.push({
        code: `
          function processor(operation: string) {
            switch (operation) {
              case 'process': {
                const processor = function(input: unknown) { // Missing return type
                  return String(input);
                };
                return processor('test');
              }
            }
          }
        `,
        errors: [{ messageId: "requireReturnType" }],
        name: "function expression in block statement without return type",
        filename: "test.ts",
      });
    } else {
      testCases.valid.push({
        code: `
          function processor(operation: string) {
            switch (operation) {
              case 'process':
                const processor = function(input: unknown): string {
                  return String(input);
                };
                return processor('test');
            }
          }
        `,
        name: "function expression in switch case with return type",
        filename: "test.ts",
      });

      testCases.invalid.push({
        code: `
          function processor(operation: string) {
            switch (operation) {
              case 'process':
                const processor = function(input: unknown) { // Missing return type
                  return String(input);
                };
                return processor('test');
            }
          }
        `,
        errors: [{ messageId: "requireReturnType" }],
        name: "function expression in switch case without return type",
        filename: "test.ts",
      });
    }
  }

  // Run the test for this specific rule
  ruleTester.run(ruleName, rule, testCases);
  console.log(`   ✅ Rule ${index + 1} tests passed`);
});

console.log("\n✅ All switch-case-functions-return-type RuleTester tests completed!");
console.log("\n🎯 Modern Testing Benefits:");
console.log("   • Uses @typescript-eslint/rule-tester v8 (latest)");
console.log("   • ESLint v9 flat config compatibility");
console.log("   • Automatic TypeScript parser handling");
console.log("   • Enhanced error reporting and type safety");
console.log("   • No manual parser configuration required");

console.log(`\n📋 Tested ${switchCaseFunctionsReturnTypeConfigs.length} rule configurations:`);
switchCaseFunctionsReturnTypeConfigs.forEach((config, index) => {
  console.log(`   ${index + 1}. ${config.selector}`);
  console.log(`      → ${config.message}`);
});

export { switchCaseFunctionsReturnTypeConfigs };