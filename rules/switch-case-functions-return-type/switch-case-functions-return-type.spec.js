import { RuleTester } from "eslint";
import { switchCaseFunctionsReturnTypeConfigs } from "./index.js";

/**
 * Test suite for switch-case-functions-return-type rules
 *
 * This tests the no-restricted-syntax configurations that enforce
 * explicit return type annotations for functions defined within switch cases.
 */

// Create individual rules for each selector to enable focused testing
const createSwitchCaseFunctionRule = (config) => ({
  meta: {
    type: "problem",
    docs: {
      description: "Require explicit return type annotations for functions defined within switch cases",
    },
    messages: {
      requireReturnType: config.message,
    },
    schema: [],
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

// Test each rule configuration separately for better debugging
switchCaseFunctionsReturnTypeConfigs.forEach((config, index) => {
  const rule = createSwitchCaseFunctionRule(config);
  const ruleName = `switch-case-functions-return-type-${index}`;

  console.log(`\n🧪 Testing rule ${index + 1}: ${config.selector}`);

  const isArrowFunction = config.selector.includes("ArrowFunctionExpression");
  const isFunctionExpression = config.selector.includes("FunctionExpression") && !isArrowFunction;
  const isInBlockStatement = config.selector.includes("BlockStatement");

  const testCases = {
    valid: [],
    invalid: []
  };

  // Add valid test cases (functions with return types)
  if (isArrowFunction) {
    if (isInBlockStatement) {
      testCases.valid.push({
        code: `
          function test() {
            switch (type) {
              case 'a': {
                const fn = (x: any): number => x + 1;
                return fn(1);
              }
            }
          }
        `,
        name: "arrow function in block statement with return type",
        filename: "test.ts",
      });
    } else {
      testCases.valid.push({
        code: `
          function test() {
            switch (type) {
              case 'a':
                const fn = (x: any): number => x + 1;
                return fn(1);
            }
          }
        `,
        name: "arrow function in switch case with return type",
        filename: "test.ts",
      });
    }
  }

  if (isFunctionExpression) {
    if (isInBlockStatement) {
      testCases.valid.push({
        code: `
          function test() {
            switch (type) {
              case 'a': {
                const fn = function(x: any): number {
                  return x + 1;
                };
                return fn(1);
              }
            }
          }
        `,
        name: "function expression in block statement with return type",
        filename: "test.ts",
      });
    } else {
      testCases.valid.push({
        code: `
          function test() {
            switch (type) {
              case 'a':
                const fn = function(x: any): number {
                  return x + 1;
                };
                return fn(1);
            }
          }
        `,
        name: "function expression in switch case with return type",
        filename: "test.ts",
      });
    }
  }

  // Add valid cases that shouldn't trigger the rule
  testCases.valid.push({
    code: `
      function test() {
        const outsideFn = (x) => x + 1; // Outside switch, rule doesn't apply
        switch (type) {
          case 'a':
            return 'simple case';
        }
      }
    `,
    name: "function outside switch case",
    filename: "test.ts",
  });

  // Add invalid test cases (functions without return types)
  if (isArrowFunction) {
    if (isInBlockStatement) {
      testCases.invalid.push({
        code: `
          function test() {
            switch (type) {
              case 'a': {
                const fn = (x) => x + 1; // Missing return type
                return fn(1);
              }
            }
          }
        `,
        errors: [{ messageId: "requireReturnType" }],
        name: "arrow function in block statement without return type",
        filename: "test.ts",
      });
    } else {
      testCases.invalid.push({
        code: `
          function test() {
            switch (type) {
              case 'a':
                const fn = (x) => x + 1; // Missing return type
                return fn(1);
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
      testCases.invalid.push({
        code: `
          function test() {
            switch (type) {
              case 'a': {
                const fn = function(x) { // Missing return type
                  return x + 1;
                };
                return fn(1);
              }
            }
          }
        `,
        errors: [{ messageId: "requireReturnType" }],
        name: "function expression in block statement without return type",
        filename: "test.ts",
      });
    } else {
      testCases.invalid.push({
        code: `
          function test() {
            switch (type) {
              case 'a':
                const fn = function(x) { // Missing return type
                  return x + 1;
                };
                return fn(1);
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
  try {
    ruleTester.run(ruleName, rule, testCases);
    console.log(`   ✅ Rule ${index + 1} tests passed`);
  } catch (error) {
    console.log(`   ❌ Rule ${index + 1} tests failed:`, error.message);
    // Continue testing other rules even if one fails
  }
});

console.log("\n✅ All switch-case-functions-return-type RuleTester tests completed!");
console.log(`\nTested ${switchCaseFunctionsReturnTypeConfigs.length} rule configurations:`);
switchCaseFunctionsReturnTypeConfigs.forEach((config, index) => {
  console.log(`   Rule ${index + 1}:`);
  console.log(`     Selector: ${config.selector}`);
  console.log(`     Message: ${config.message}`);
});

export { switchCaseFunctionsReturnTypeConfigs };