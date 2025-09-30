import { RuleTester } from "eslint";
import { noTrivialTypeAliasesConfigs } from "./index.js";

/**
 * Test suite for no-trivial-type-aliases rule
 *
 * This tests the no-restricted-syntax configurations that prevent
 * trivial TypeScript type aliases.
 */

// Create custom rules for testing our selectors
const createRuleFromConfig = (config, messageId) => ({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow trivial type aliases",
    },
    messages: {
      [messageId]: config.message,
    },
    schema: [],
  },
  create(context) {
    return {
      [config.selector](node) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
});

const primitiveTypeRule = createRuleFromConfig(
  noTrivialTypeAliasesConfigs[1], // primitive types rule
  "noPrimitiveTypes"
);

const typeReferenceRule = createRuleFromConfig(
  noTrivialTypeAliasesConfigs[0], // type reference rule
  "noTypeReferences"
);

const literalTypeRule = createRuleFromConfig(
  noTrivialTypeAliasesConfigs[2], // literal types rule
  "noLiteralTypes"
);

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

// Test primitive type aliases
ruleTester.run("no-trivial-type-aliases-primitive", primitiveTypeRule, {
  valid: [
    // Valid: Union types
    { code: "type StringOrNumber = string | number;" },
    { code: "type Status = 'active' | 'inactive' | 'pending';" },

    // Valid: Generic types
    { code: "type Container<T> = { value: T };" },
    { code: "type Array<T> = T[];" },

    // Valid: Interfaces (not type aliases)
    { code: "interface User { name: string; }" },

    // Valid: Complex types
    { code: "type Partial<T> = { [P in keyof T]?: T[P] };" },
  ],

  invalid: [
    // Invalid: Primitive type aliases
    {
      code: "type MyString = string;",
      errors: [{ messageId: "noPrimitiveTypes" }],
    },
    {
      code: "type MyNumber = number;",
      errors: [{ messageId: "noPrimitiveTypes" }],
    },
    {
      code: "type MyBoolean = boolean;",
      errors: [{ messageId: "noPrimitiveTypes" }],
    },
    {
      code: "type MyUnknown = unknown;",
      errors: [{ messageId: "noPrimitiveTypes" }],
    },
  ],
});

// Test type reference aliases
ruleTester.run("no-trivial-type-aliases-reference", typeReferenceRule, {
  valid: [
    // Valid: Type references with generics
    { code: "type UserList = Array<User>;" },
    { code: "type Promise<T> = Promise<T>;" },

    // Valid: Union with type references
    { code: "type ID = string | User;" },

    // Valid: Interfaces
    { code: "interface User { name: string; }" },
  ],

  invalid: [
    // Invalid: Direct type reference without generics
    {
      code: "interface User { name: string; } type MyUser = User;",
      errors: [{ messageId: "noTypeReferences" }],
    },
    {
      code: "type ID = string; type UserID = ID;",
      errors: [{ messageId: "noTypeReferences" }],
    },
  ],
});

// Test literal type aliases
ruleTester.run("no-trivial-type-aliases-literal", literalTypeRule, {
  valid: [
    // Valid: Union of literals
    { code: "type Status = 'active' | 'inactive';" },
    { code: "type Numbers = 1 | 2 | 3;" },

    // Valid: No type aliases
    { code: "const status = 'active';" },
  ],

  invalid: [
    // Invalid: Single literal type aliases
    {
      code: "type Status = 'active';",
      errors: [{ messageId: "noLiteralTypes" }],
    },
    {
      code: "type Count = 42;",
      errors: [{ messageId: "noLiteralTypes" }],
    },
    {
      code: "type IsReady = true;",
      errors: [{ messageId: "noLiteralTypes" }],
    },
  ],
});

console.log("✅ All no-trivial-type-aliases tests passed!");
noTrivialTypeAliasesConfigs.forEach((config, index) => {
  console.log(`   Rule ${index + 1} - Selector: ${config.selector}`);
  console.log(`   Rule ${index + 1} - Message: ${config.message}`);
});

export { primitiveTypeRule, typeReferenceRule, literalTypeRule };