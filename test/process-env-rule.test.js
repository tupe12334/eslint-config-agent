import { RuleTester } from "eslint";

// Create a custom rule for testing our selector
const noProcessEnvRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow direct access to process.env properties",
    },
    messages: {
      noProcessEnv:
        "Direct access to process.env properties is not allowed. Use a configuration object or environment validation instead.",
    },
    schema: [],
  },
  create(context) {
    return {
      "MemberExpression[object.type='MemberExpression'][object.object.name='process'][object.property.name='env']"(
        node
      ) {
        context.report({
          node,
          messageId: "noProcessEnv",
        });
      },
    };
  },
};

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
});

// Test the rule
console.log("Testing no-process-env rule...");

ruleTester.run("no-process-env", noProcessEnvRule, {
  valid: [
    "const config = { nodeEnv: 'development' };",
    "const env = getEnvironmentConfig();",
    "process.exit(1);",
    "process.env;",
    "process.stdout.write('test');",
  ],
  invalid: [
    {
      code: "const nodeEnv = process.env.NODE_ENV;",
      errors: [{ messageId: "noProcessEnv" }],
    },
    {
      code: "const port = process.env.PORT;",
      errors: [{ messageId: "noProcessEnv" }],
    },
    {
      code: "process.env.NODE_ENV();",
      errors: [{ messageId: "noProcessEnv" }],
    },
    {
      code: "const result = process.env.DATABASE_URL.toLowerCase();",
      errors: [{ messageId: "noProcessEnv" }],
    },
    {
      code: "console.log(process.env.NODE_ENV);",
      errors: [{ messageId: "noProcessEnv" }],
    },
  ],
});

console.log("✅ All tests passed!");
