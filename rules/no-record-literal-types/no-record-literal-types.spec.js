import { RuleTester } from 'eslint'
import { noRecordLiteralTypesConfigs, message } from './index.js'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: await import('@typescript-eslint/parser'),
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

// Create a mock rule that handles dual selectors properly
const mockRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow Record type with string literal keys',
    },
    schema: [],
  },
  create(context) {
    const handlers = {}

    // Add handlers for both selectors from our configuration
    noRecordLiteralTypesConfigs.forEach(config => {
      handlers[config.selector] = node => {
        context.report({
          node,
          message: config.message,
        })
      }
    })

    return handlers
  },
}

ruleTester.run('no-record-literal-types', mockRule, {
  valid: [
    // Generic Record types (allowed)
    'type UserData = Record<string, unknown>;',
    'type Config = Record<PropertyKey, string>;',
    'type IndexMap = Record<number, string>;',

    // Specific interfaces (preferred alternative)
    'interface UserInfo { name: string; age: string; }',
    'type Status = { active: boolean; }',

    // Non-Record types
    'type Union = "foo" | "bar" | "baz";',
    'interface BaseProps { id: string; }',

    // Template literal types (allowed)
    'type Dynamic = Record<`prefix-${string}`, boolean>;',
    'type Computed = Record<`${string}-suffix`, number>;',

    // Regular variables
    'const user = { name: "John", age: 30 };',
  ],
  invalid: [
    // Direct literal - RuleTester shows only nested selector matches
    {
      code: 'type UserName = Record<"name", string>;',
      errors: [{ message }],
    },

    // Union literals - nested selector catches each literal
    {
      code: 'type UserInfo = Record<"name" | "age", string>;',
      errors: [{ message }, { message }],
    },

    // Multiple union literals - nested selector catches each literal
    {
      code: 'type Config = Record<"host" | "port" | "ssl", string>;',
      errors: [{ message }, { message }, { message }],
    },

    // Variable annotation
    {
      code: 'const data: Record<"key", unknown> = {};',
      errors: [{ message }],
    },

    // Function parameter
    {
      code: 'function process(input: Record<"value", string>) {}',
      errors: [{ message }],
    },

    // Function return type
    {
      code: 'function getStatus(): Record<"status", string> { return {}; }',
      errors: [{ message }],
    },
  ],
})
