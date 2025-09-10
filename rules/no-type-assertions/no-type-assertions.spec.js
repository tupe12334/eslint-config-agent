import { RuleTester } from "eslint";
import { noTypeAssertionsConfig } from "./index.js";

/**
 * Test suite for no-type-assertions rule
 *
 * This tests the no-restricted-syntax configuration that prevents
 * TypeScript type assertions using "as" keyword except for "as const".
 */

// Create a custom rule for testing our selector
const noTypeAssertionsRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow type assertions except 'as const'",
    },
    messages: {
      noTypeAssertions: noTypeAssertionsConfig.message,
    },
    schema: [],
  },
  create(context) {
    return {
      [noTypeAssertionsConfig.selector](node) {
        context.report({
          node,
          messageId: "noTypeAssertions",
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

ruleTester.run("no-type-assertions", noTypeAssertionsRule, {
  valid: [
    // Valid: "as const" usage
    {
      code: "const config = { mode: 'production' } as const;",
      name: "object as const",
    },
    {
      code: "const colors = ['red', 'green', 'blue'] as const;",
      name: "array as const",
    },
    {
      code: "const status = 'loading' as const;",
      name: "string literal as const",
    },
    {
      code: "const numbers = [1, 2, 3] as const;",
      name: "number array as const",
    },
    {
      code: "const tuple = ['name', 42, true] as const;",
      name: "mixed tuple as const",
    },
    {
      code: "const nested = { items: [{ id: 1 }] as const } as const;",
      name: "nested as const",
    },

    // Valid: No type assertions at all
    {
      code: "const value: string = 'hello';",
      name: "type annotation instead of assertion",
    },
    {
      code: "function getValue(): string { return 'test'; }",
      name: "function with return type",
    },
    {
      code: "interface User { name: string; } const user: User = { name: 'John' };",
      name: "interface with proper typing",
    },
    {
      code: "const element = document.getElementById('test');",
      name: "no type assertion on DOM access",
    },
  ],

  invalid: [
    // Invalid: Basic type assertions
    {
      code: "declare const value: unknown; const str = value as string;",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "basic string assertion",
    },
    {
      code: "declare const value: unknown; const num = value as number;",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "basic number assertion",
    },
    {
      code: "declare const value: unknown; const bool = value as boolean;",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "basic boolean assertion",
    },

    // Invalid: Interface and type assertions
    {
      code: "interface User { name: string; } declare const value: unknown; const user = value as User;",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "interface assertion",
    },
    {
      code: "type Status = 'loading' | 'success'; declare const value: unknown; const status = value as Status;",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "type alias assertion",
    },

    // Invalid: DOM element assertions
    {
      code: "const element = document.getElementById('test') as HTMLInputElement;",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "DOM element assertion",
    },
    {
      code: "const button = document.querySelector('.btn') as HTMLButtonElement;",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "DOM querySelector assertion",
    },

    // Invalid: Object and array assertions
    {
      code: "declare const data: unknown; const obj = data as { name: string };",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "object literal type assertion",
    },
    {
      code: "declare const data: unknown; const arr = data as string[];",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "array type assertion",
    },
    {
      code: "declare const data: unknown; const tuple = data as [string, number];",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "tuple type assertion",
    },

    // Invalid: Function parameter and return assertions
    {
      code: "function test(param: unknown) { return param as string; }",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "return value assertion",
    },
    {
      code: "const fn = (value: unknown) => value as number;",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "arrow function assertion",
    },

    // Invalid: Complex expressions
    {
      code: "declare const api: any; const result = api.getData() as Promise<User>;",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "method call assertion",
    },
    {
      code: "declare const obj: any; const prop = obj.property as string;",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "property access assertion",
    },
    {
      code: "declare const arr: any[]; const first = arr[0] as string;",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "array access assertion",
    },

    // Invalid: Generic type assertions
    {
      code: "declare const value: unknown; const generic = value as Array<string>;",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "generic type assertion",
    },
    {
      code: "declare const value: unknown; const promise = value as Promise<number>;",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "Promise generic assertion",
    },

    // Invalid: Any type assertions
    {
      code: "declare const value: unknown; const anything = value as any;",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "any type assertion",
    },

    // Invalid: Chained assertions
    {
      code: "declare const value: unknown; const result = (value as any).prop as string;",
      errors: [
        { messageId: "noTypeAssertions" },
        { messageId: "noTypeAssertions" }
      ],
      name: "chained assertions",
    },

    // Invalid: Template literal expressions
    {
      code: "declare const id: unknown; const message = `User ID: ${id as string}`;",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "assertion in template literal",
    },

    // Invalid: Conditional expressions
    {
      code: "declare const value: unknown; const result = value ? value as string : 'default';",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "assertion in conditional",
    },

    // Invalid: Object property values
    {
      code: "declare const name: unknown; const user = { name: name as string, age: 30 };",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "assertion in object property",
    },

    // Invalid: Array elements
    {
      code: "declare const item: unknown; const items = [item as string, 'other'];",
      errors: [{ messageId: "noTypeAssertions" }],
      name: "assertion in array element",
    },
  ],
});

console.log("✅ All no-type-assertions tests passed!");
console.log(`   Selector: ${noTypeAssertionsConfig.selector}`);
console.log(`   Message: ${noTypeAssertionsConfig.message}`);

export { noTypeAssertionsRule };