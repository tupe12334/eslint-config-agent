import { RuleTester } from 'eslint'
import {
  noInlineUnionTypesConfigs,
  messageGeneral,
  messageProperty,
  messageClassProperty,
} from './index.js'

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

// Create a mock rule that handles multiple selectors properly
const mockRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow inline union types in favor of named type declarations',
    },
    schema: [],
  },
  create(context) {
    const handlers = {}

    // Add handlers for all selectors from our configuration
    noInlineUnionTypesConfigs.forEach(config => {
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

ruleTester.run('no-inline-union-types', mockRule, {
  valid: [
    // Named type declarations (preferred)
    'type Status = "active" | "inactive"; function foo(status: Status) {}',
    'type Role = "admin" | "user"; interface User { role: Role; }',
    'type Mode = "dev" | "prod"; class Config { mode: Mode; }',

    // Interfaces with named types
    'type Audience = "open" | "professional"; interface Params { audience?: Audience; }',

    // Generic union types at declaration level
    'type Status = "pending" | "success" | "error";',
    'type Theme = "light" | "dark" | "auto";',

    // Non-union types are fine
    'interface User { name: string; age: number; }',
    'class Config { host: string; }',
  ],
  invalid: [
    // Function parameters with inline unions
    {
      code: 'function foo(status: "active" | "inactive") {}',
      errors: [{ message: messageGeneral }],
    },

    // Interface properties with literal unions
    {
      code: 'interface User { role: "admin" | "user"; }',
      errors: [{ message: messageProperty }],
    },

    // Class properties with literal unions
    {
      code: 'class Config { mode: "dev" | "prod"; }',
      errors: [{ message: messageClassProperty }],
    },

    // Multiple interface properties
    {
      code: `interface Params {
        audience?: "open" | "professional";
        offered_by?: "Bootcamps" | "CSAIL";
      }`,
      errors: [{ message: messageProperty }, { message: messageProperty }],
    },

    // Type alias with inline union in properties
    {
      code: 'type User = { status: "active" | "inactive"; };',
      errors: [{ message: messageProperty }],
    },

    // Arrow function parameters
    {
      code: 'const handler = (type: "click" | "hover") => {};',
      errors: [{ message: messageGeneral }],
    },
  ],
})
