import { RuleTester } from "eslint";
import noEnvAccessRule from "./index.js";

// Create RuleTester instance
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
});

// Test the no-env-access custom rule
ruleTester.run("no-env-access", noEnvAccessRule, {
  valid: [
    // Valid: not accessing properties on 'env'
    "const foo = 'bar';",
    "const config = getEnvConfig();",
    "const nodeEnv = config.NODE_ENV;",

    // Valid: 'env' as a value, not property access
    "const env = 'production';",
    "const environment = env;",
    "const settings = { env: 'development' };",
    "const mode = settings.env;",

    // Valid: different variable names
    "const environment = { NODE_ENV: 'test' };",
    "const nodeEnv = environment.NODE_ENV;",
    "const config = { NODE_ENV: 'prod' };",
    "const env_config = { PORT: 3000 };",
    "const port = env_config.PORT;",

    // Valid: function calls
    "env();",
    "env.call();",
    "env.apply();",
    "getEnv().NODE_ENV;",

    // Valid: bracket notation (not enforced by this rule)
    "const nodeEnv = env['NODE_ENV'];",
    "const port = env['PORT'];",

    // Valid: other operations
    "typeof env;",
    "env instanceof Object;",
    "env || 'default';",
    "env ? 'prod' : 'dev';",

    // Valid: in function parameters, destructuring, etc.
    "function test(env) { return env; }",
    "const { env } = config;",
    "const [env] = environments;",

    // Valid: class members named env
    "class Config { env = 'prod'; }",
    "const config = new Config(); config.env;",

    // Valid: accessing properties on process.env (handled by different rule)
    "const nodeEnv = process.env.NODE_ENV;",
    "const port = process.env.PORT;",
  ],

  invalid: [
    // Invalid: direct property access on 'env' variable
    {
      code: "const nodeEnv = env.NODE_ENV;",
      errors: [
        {
          messageId: "noEnvAccess",
          type: "MemberExpression",
        },
      ],
    },
    {
      code: "const port = env.PORT;",
      errors: [
        {
          messageId: "noEnvAccess",
          type: "MemberExpression",
        },
      ],
    },
    {
      code: "const apiUrl = env.API_URL;",
      errors: [
        {
          messageId: "noEnvAccess",
          type: "MemberExpression",
        },
      ],
    },
    {
      code: "const dbUrl = env.DATABASE_URL;",
      errors: [
        {
          messageId: "noEnvAccess",
          type: "MemberExpression",
        },
      ],
    },

    // Invalid: multiple accesses in same code
    {
      code: `
        const nodeEnv = env.NODE_ENV;
        const port = env.PORT;
        const dbUrl = env.DATABASE_URL;
      `,
      errors: [
        { messageId: "noEnvAccess", type: "MemberExpression" },
        { messageId: "noEnvAccess", type: "MemberExpression" },
        { messageId: "noEnvAccess", type: "MemberExpression" },
      ],
    },

    // Invalid: in various contexts
    {
      code: "console.log(env.NODE_ENV);",
      errors: [{ messageId: "noEnvAccess", type: "MemberExpression" }],
    },
    {
      code: "if (env.NODE_ENV === 'production') { }",
      errors: [{ messageId: "noEnvAccess", type: "MemberExpression" }],
    },
    {
      code: "const config = { nodeEnv: env.NODE_ENV };",
      errors: [{ messageId: "noEnvAccess", type: "MemberExpression" }],
    },
    {
      code: "function test() { return env.NODE_ENV || 'development'; }",
      errors: [{ messageId: "noEnvAccess", type: "MemberExpression" }],
    },
    {
      code: "const port = parseInt(env.PORT, 10);",
      errors: [{ messageId: "noEnvAccess", type: "MemberExpression" }],
    },

    // Invalid: function calls on accessed properties
    {
      code: "const lower = env.NODE_ENV.toLowerCase();",
      errors: [{ messageId: "noEnvAccess", type: "MemberExpression" }],
    },
    {
      code: "const trimmed = env.API_URL.trim();",
      errors: [{ messageId: "noEnvAccess", type: "MemberExpression" }],
    },

    // Invalid: in function parameters and returns
    {
      code: "function getNodeEnv() { return env.NODE_ENV; }",
      errors: [{ messageId: "noEnvAccess", type: "MemberExpression" }],
    },
    {
      code: "const fn = () => env.NODE_ENV;",
      errors: [{ messageId: "noEnvAccess", type: "MemberExpression" }],
    },
    {
      code: "someFunction(env.NODE_ENV, env.PORT);",
      errors: [
        { messageId: "noEnvAccess", type: "MemberExpression" },
        { messageId: "noEnvAccess", type: "MemberExpression" },
      ],
    },

    // Invalid: in object/array literals
    {
      code: "const config = [env.NODE_ENV, env.PORT];",
      errors: [
        { messageId: "noEnvAccess", type: "MemberExpression" },
        { messageId: "noEnvAccess", type: "MemberExpression" },
      ],
    },

    // Invalid: in template literals
    {
      code: "const message = `Environment: ${env.NODE_ENV}`;",
      errors: [{ messageId: "noEnvAccess", type: "MemberExpression" }],
    },

    // Invalid: in assignments and operations
    {
      code: "let nodeEnv; nodeEnv = env.NODE_ENV;",
      errors: [{ messageId: "noEnvAccess", type: "MemberExpression" }],
    },
    {
      code: "const isDev = env.NODE_ENV === 'development';",
      errors: [{ messageId: "noEnvAccess", type: "MemberExpression" }],
    },
  ],
});

console.log("✅ All no-env-access rule tests passed!");
console.log("   Rule prevents direct access to properties on 'env' variables");
console.log(
  "   Encourages use of configuration objects for better environment handling"
);
