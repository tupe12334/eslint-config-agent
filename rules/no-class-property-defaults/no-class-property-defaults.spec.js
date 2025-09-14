import { RuleTester } from "eslint";
import { noClassPropertyDefaultsConfig } from "./index.js";

/**
 * Test suite for no-class-property-defaults rule
 *
 * This tests the no-restricted-syntax configuration that prevents
 * class properties from having default values.
 */

// Create a custom rule for testing our selector
const noClassPropertyDefaultsRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow class properties with default values",
    },
    messages: {
      noClassPropertyDefaults: noClassPropertyDefaultsConfig.message,
    },
    schema: [],
  },
  create(context) {
    return {
      [noClassPropertyDefaultsConfig.selector](node) {
        context.report({
          node,
          messageId: "noClassPropertyDefaults",
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

ruleTester.run("no-class-property-defaults", noClassPropertyDefaultsRule, {
  valid: [
    // Valid: No default values, initialized in constructor
    {
      code: `class User {
        name: string;
        age: number;

        constructor(name: string, age: number) {
          this.name = name;
          this.age = age;
        }
      }`,
      name: "constructor initialization",
    },
    {
      code: `class Service {
        config: object;
        isReady: boolean;

        constructor() {
          this.config = {};
          this.isReady = false;
        }
      }`,
      name: "constructor with default values",
    },
    {
      code: `class Counter {
        value: number;

        constructor() {
          this.reset();
        }

        reset() {
          this.value = 0;
        }
      }`,
      name: "method initialization",
    },
    {
      code: `class Handler {
        callback: Function;

        setCallback(fn: Function) {
          this.callback = fn;
        }
      }`,
      name: "method-based property setting",
    },
    {
      code: `class Collection {
        items: string[];

        constructor(items?: string[]) {
          this.items = items || [];
        }
      }`,
      name: "conditional constructor initialization",
    },
    {
      code: `class Abstract {
        abstract value: string;
      }`,
      name: "abstract property without default",
    },
    {
      code: `class Readonly {
        readonly id: string;

        constructor(id: string) {
          this.id = id;
        }
      }`,
      name: "readonly property without default",
    },
  ],

  invalid: [
    // Invalid: String defaults
    {
      code: `class User {
        name = 'default';
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "string default value",
    },
    {
      code: `class User {
        email = '';
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "empty string default",
    },

    // Invalid: Number defaults
    {
      code: `class Counter {
        count = 0;
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "number default value",
    },
    {
      code: `class Settings {
        timeout = 5000;
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "positive number default",
    },

    // Invalid: Boolean defaults
    {
      code: `class Feature {
        enabled = false;
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "boolean false default",
    },
    {
      code: `class Debug {
        verbose = true;
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "boolean true default",
    },

    // Invalid: Array defaults
    {
      code: `class Collection {
        items = [];
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "empty array default",
    },
    {
      code: `class Tags {
        list = ['default'];
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "array with values default",
    },

    // Invalid: Object defaults
    {
      code: `class Config {
        settings = {};
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "empty object default",
    },
    {
      code: `class Options {
        config = { debug: false };
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "object with properties default",
    },

    // Invalid: Function defaults
    {
      code: `class Handler {
        callback = () => {};
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "arrow function default",
    },
    {
      code: `class Processor {
        handler = function() { return null; };
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "function expression default",
    },

    // Invalid: Complex expression defaults
    {
      code: `class Random {
        value = Math.random();
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "Math.random() default",
    },
    {
      code: `class Timestamp {
        created = new Date();
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "new Date() default",
    },
    {
      code: `class Api {
        baseUrl = process.env.API_URL || 'localhost';
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "environment variable default",
    },

    // Invalid: Multiple properties with defaults
    {
      code: `class Multiple {
        name = 'test';
        count = 0;
        active = true;
      }`,
      errors: [
        { messageId: "noClassPropertyDefaults" },
        { messageId: "noClassPropertyDefaults" },
        { messageId: "noClassPropertyDefaults" },
      ],
      name: "multiple properties with defaults",
    },

    // Invalid: Mixed valid and invalid
    {
      code: `class Mixed {
        validProp: string;
        invalidProp = 'default';

        constructor() {
          this.validProp = 'set in constructor';
        }
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "mixed valid and invalid properties",
    },

    // Invalid: TypeScript specific patterns
    {
      code: `class TypeScript {
        private _value = 0;
        public name = 'default';
        protected config = {};
      }`,
      errors: [
        { messageId: "noClassPropertyDefaults" },
        { messageId: "noClassPropertyDefaults" },
        { messageId: "noClassPropertyDefaults" },
      ],
      name: "access modifiers with defaults",
    },
    {
      code: `class Static {
        static defaultConfig = { debug: false };
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "static property with default",
    },
    {
      code: `class ReadonlyDefault {
        readonly id = 'default-id';
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "readonly property with default",
    },

    // Invalid: Generic and complex types
    {
      code: `class Generic<T> {
        data: T[] = [];
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "generic type with default",
    },
    {
      code: `class Promise {
        result: Promise<string> = Promise.resolve('default');
      }`,
      errors: [{ messageId: "noClassPropertyDefaults" }],
      name: "Promise default value",
    },
  ],
});

console.log("✅ All no-class-property-defaults tests passed!");
console.log(`   Selector: ${noClassPropertyDefaultsConfig.selector}`);
console.log(`   Message: ${noClassPropertyDefaultsConfig.message}`);

export { noClassPropertyDefaultsRule };