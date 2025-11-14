import { RuleTester } from '@typescript-eslint/rule-tester'
import { switchCaseExplicitReturnConfigs } from './index.js'

/**
 * Test suite for switch-case-explicit-return rules
 *
 * This uses the modern 2024 approach with @typescript-eslint/rule-tester v8
 * and ESLint v9 flat config for testing TypeScript ESLint rules.
 */

// Custom error class for test failures
export class TestError extends Error {
  constructor(message) {
    super(message)
    this.name = 'TestError'
  }
}

// Configure RuleTester for Node.js test environment (modern best practice)
RuleTester.afterAll = () => {} // No cleanup needed for simple tests
RuleTester.describe = (name, fn) => {
  console.log(`\n📝 ${name}`)
  fn()
}
RuleTester.it = (name, fn) => {
  try {
    fn()
    console.log(`   ✅ ${name}`)
  } catch (error) {
    console.log(`   ❌ ${name}: ${error.message}`)
    throw new TestError(error.message || 'Test failed')
  }
}
RuleTester.itOnly = RuleTester.it

// Modern ESLint v9 + typescript-eslint v8 configuration
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

// Create individual rules for each selector configuration
const createSwitchCaseExplicitReturnRule = config => ({
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require explicit return values in switch case return statements',
      recommended: 'strict',
    },
    messages: {
      requireExplicitReturn: config.message,
    },
    schema: [],
    fixable: null,
  },
  create(context) {
    return {
      [config.selector]: function (node) {
        context.report({
          node,
          messageId: 'requireExplicitReturn',
        })
      },
    }
  },
})

console.log(
  '🧪 Testing switch-case-explicit-return rules with modern RuleTester...'
)

// Test each rule configuration
switchCaseExplicitReturnConfigs.forEach((config, index) => {
  const rule = createSwitchCaseExplicitReturnRule(config)
  const ruleName = `switch-case-explicit-return-${index}`

  const isInBlockStatement = config.selector.includes('BlockStatement')

  console.log(`\n🔍 Rule ${index + 1}: ${config.selector}`)

  const testCases = {
    valid: [
      // Valid: Switch cases with explicit return values
      {
        code: `
          function processAction(action: string): string | undefined {
            switch (action) {
              case 'skip':
                return undefined; // Explicit undefined return
              case 'process':
                return 'processed';
            }
          }
        `,
        name: 'explicit return values in switch cases',
        filename: 'test.ts',
      },

      // Valid: Switch cases using break instead of return
      {
        code: `
          function processWithBreak(action: string): string {
            let result = 'default';
            switch (action) {
              case 'skip':
                result = 'skipped';
                break; // Use break instead of return
              case 'process':
                result = 'processed';
                break;
            }
            return result;
          }
        `,
        name: 'switch cases using break instead of return',
        filename: 'test.ts',
      },

      // Valid: Switch without return statements
      {
        code: `
          function logAction(action: string): void {
            switch (action) {
              case 'log':
                console.log('Action logged');
                break;
              case 'save':
                saveData();
                break;
            }
          }
        `,
        name: 'switch without return statements',
        filename: 'test.ts',
      },

      // Valid: Return statements outside switch cases
      {
        code: `
          function simpleFunction(value: boolean): string | undefined {
            if (value) {
              return; // Empty return outside switch is allowed
            }
            return 'default';
          }
        `,
        name: 'empty return outside switch case',
        filename: 'test.ts',
      },
    ],
    invalid: [],
  }

  // Add specific test cases based on rule type
  if (isInBlockStatement) {
    testCases.valid.push({
      code: `
        function handleWithBlocks(type: string): string {
          switch (type) {
            case 'early': {
              if (someCondition) {
                return 'early-exit'; // Explicit return in block
              }
              return 'completed';
            }
            case 'normal':
              return 'done';
          }
        }
      `,
      name: 'explicit return values in block statements',
      filename: 'test.ts',
    })

    testCases.invalid.push({
      code: `
        function handleWithBlocks(type: string): string {
          switch (type) {
            case 'early': {
              return; // Empty return in block - not allowed
            }
            case 'normal':
              return 'done';
          }
        }
      `,
      errors: [{ messageId: 'requireExplicitReturn' }],
      name: 'empty return in block statement within switch case',
      filename: 'test.ts',
    })

    testCases.invalid.push({
      code: `
        function complexAction(action: any): any {
          switch (action.type) {
            case 'RESET': {
              return; // Empty return in block - not allowed
            }
            case 'UPDATE': {
              return action.payload;
            }
          }
        }
      `,
      errors: [{ messageId: 'requireExplicitReturn' }],
      name: 'empty return in block after side effect',
      filename: 'test.ts',
    })
  } else {
    testCases.valid.push({
      code: `
        function findItem(id: string): Item | null {
          switch (id) {
            case 'unknown':
              return null; // Explicit null return
            case 'special':
              return getSpecialItem();
            default:
              return getItem(id);
          }
        }
      `,
      name: 'explicit null and object returns',
      filename: 'test.ts',
    })

    testCases.invalid.push({
      code: `
        function processAction(action: string): string | undefined {
          switch (action) {
            case 'skip':
              return; // Empty return - not allowed
            case 'process':
              return 'processed';
          }
        }
      `,
      errors: [{ messageId: 'requireExplicitReturn' }],
      name: 'empty return in switch case',
      filename: 'test.ts',
    })

    testCases.invalid.push({
      code: `
        function multipleEmptyReturns(status: string): string {
          switch (status) {
            case 'pending':
              return; // Empty return - not allowed
            case 'cancelled':
              return; // Empty return - not allowed
            case 'completed':
              return 'finished';
          }
        }
      `,
      errors: [
        { messageId: 'requireExplicitReturn' },
        { messageId: 'requireExplicitReturn' },
      ],
      name: 'multiple empty returns in different cases',
      filename: 'test.ts',
    })

    testCases.invalid.push({
      code: `
        function validateInput(input: any): boolean {
          switch (input.type) {
            case 'invalid':
              return; // Empty return - not allowed
            case 'valid':
              return true;
            default:
              return false;
          }
        }
      `,
      errors: [{ messageId: 'requireExplicitReturn' }],
      name: 'empty return instead of explicit boolean',
      filename: 'test.ts',
    })
  }

  // Run the test for this specific rule
  ruleTester.run(ruleName, rule, testCases)
  console.log(`   ✅ Rule ${index + 1} tests passed`)
})

console.log('\n✅ All switch-case-explicit-return RuleTester tests completed!')
console.log('\n🎯 Modern Testing Benefits:')
console.log('   • Uses @typescript-eslint/rule-tester v8 (latest)')
console.log('   • ESLint v9 flat config compatibility')
console.log('   • Automatic TypeScript parser handling')
console.log('   • Enhanced error reporting and type safety')
console.log('   • No manual parser configuration required')

console.log(
  `\n📋 Tested ${switchCaseExplicitReturnConfigs.length} rule configurations:`
)
switchCaseExplicitReturnConfigs.forEach((config, index) => {
  console.log(`   ${index + 1}. ${config.selector}`)
  console.log(`      → ${config.message}`)
})
