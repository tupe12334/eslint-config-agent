import { RuleTester } from "eslint";
import { noProcessEnvPropertiesConfig } from "./index.js";

/**
 * Test suite for no-process-env-properties rule
 *
 * This tests the no-restricted-syntax configuration that prevents
 * direct access to process.env properties while allowing process.env
 * to be used as a whole object.
 */

// Create a custom rule for testing our selector
const noProcessEnvPropertiesRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow direct access to process.env properties",
    },
    messages: {
      noProcessEnvProperties: noProcessEnvPropertiesConfig.message,
    },
    schema: [],
  },
  create(context) {
    return {
      [noProcessEnvPropertiesConfig.selector](node) {
        context.report({
          node,
          messageId: "noProcessEnvProperties",
        });
      },
    };
  },
};

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      process: "readonly",
    },
  },
});
  ruleTester.run("no-process-env-properties", noProcessEnvPropertiesRule, {
    valid: [
      // Valid: Using process.env as whole object
      {
        code: "const config = validate(process.env);",
        name: "passing process.env to function",
      },
      {
        code: "const result = setupConfig(process.env);",
        name: "passing process.env to setup function",
      },
      {
        code: "const env = process.env;",
        name: "assigning process.env to variable",
      },
      {
        code: "const { NODE_ENV, PORT } = process.env;",
        name: "destructuring process.env",
      },
      {
        code: "function getConfig(env = process.env) { return env; }",
        name: "using process.env as default parameter",
      },

      // Valid: Other process usage
      {
        code: "process.exit(1);",
        name: "using process.exit",
      },
      {
        code: "process.stdout.write('test');",
        name: "using process.stdout",
      },
      {
        code: "process.cwd();",
        name: "using process.cwd",
      },

      // Valid: Similar patterns that should not match
      {
        code: "const env = { NODE_ENV: 'test' };",
        name: "regular object with NODE_ENV",
      },
      {
        code: "obj.env.NODE_ENV;",
        name: "different object with env property",
      },
      {
        code: "process.environment.NODE_ENV;",
        name: "process with different property than env",
      },

      // Valid: Complex expressions with process.env as whole
      {
        code: "const config = merge(defaultConfig, process.env);",
        name: "merging with process.env",
      },
      {
        code: "const isValid = validator.validate(process.env);",
        name: "validating process.env",
      },
    ],

    invalid: [
      // Invalid: Direct property access
      {
        code: "const nodeEnv = process.env.NODE_ENV;",
        errors: [{ messageId: "noProcessEnvProperties" }],
        name: "accessing NODE_ENV property",
      },
      {
        code: "const port = process.env.PORT;",
        errors: [{ messageId: "noProcessEnvProperties" }],
        name: "accessing PORT property",
      },
      {
        code: "const dbUrl = process.env.DATABASE_URL;",
        errors: [{ messageId: "noProcessEnvProperties" }],
        name: "accessing DATABASE_URL property",
      },

      // Invalid: Property access in expressions
      {
        code: "console.log(process.env.NODE_ENV);",
        errors: [{ messageId: "noProcessEnvProperties" }],
        name: "using property in console.log",
      },
      {
        code: "const isDev = process.env.NODE_ENV === 'development';",
        errors: [{ messageId: "noProcessEnvProperties" }],
        name: "using property in comparison",
      },
      {
        code: "const port = process.env.PORT || 3000;",
        errors: [{ messageId: "noProcessEnvProperties" }],
        name: "using property with logical OR",
      },
      {
        code: "const port = Number(process.env.PORT);",
        errors: [{ messageId: "noProcessEnvProperties" }],
        name: "using property in function call",
      },

      // Invalid: Method calls on properties
      {
        code: "const url = process.env.DATABASE_URL.toLowerCase();",
        errors: [{ messageId: "noProcessEnvProperties" }],
        name: "calling method on property",
      },
      {
        code: "process.env.NODE_ENV();",
        errors: [{ messageId: "noProcessEnvProperties" }],
        name: "calling property as function",
      },

      // Invalid: Complex expressions
      {
        code: "const config = { nodeEnv: process.env.NODE_ENV, port: 3000 };",
        errors: [{ messageId: "noProcessEnvProperties" }],
        name: "using property in object literal",
      },
      {
        code: "function getEnv() { return process.env.NODE_ENV ? 'dev' : 'prod'; }",
        errors: [{ messageId: "noProcessEnvProperties" }],
        name: "using property in ternary operator",
      },
      {
        code: "const values = [process.env.NODE_ENV, process.env.PORT];",
        errors: [
          { messageId: "noProcessEnvProperties" },
          { messageId: "noProcessEnvProperties" }
        ],
        name: "using multiple properties in array",
      },

      // Invalid: Template literals
      {
        code: "const message = `Environment: ${process.env.NODE_ENV}`;",
        errors: [{ messageId: "noProcessEnvProperties" }],
        name: "using property in template literal",
      },

      // Invalid: Assignment patterns
      {
        code: "let nodeEnv; nodeEnv = process.env.NODE_ENV;",
        errors: [{ messageId: "noProcessEnvProperties" }],
        name: "assigning property to variable",
      },

      // Invalid: Function parameters
      {
        code: "function setup(env = process.env.NODE_ENV) { }",
        errors: [{ messageId: "noProcessEnvProperties" }],
        name: "using property as default parameter value",
      },
    ],
  });

console.log("✅ All no-process-env-properties tests passed!");
console.log(`   Selector: ${noProcessEnvPropertiesConfig.selector}`);
console.log(`   Message: ${noProcessEnvPropertiesConfig.message}`);

export { noProcessEnvPropertiesRule };