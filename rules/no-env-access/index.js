/**
 * Custom ESLint rule: no-env-access
 *
 * Prevents direct access to properties on variables named 'env'.
 * This encourages the use of configuration objects or environment validation
 * instead of directly accessing environment variables.
 *
 * @example
 * // ❌ Bad - direct env access
 * const nodeEnv = env.NODE_ENV;
 * const port = env.PORT;
 *
 * // ✅ Good - configuration object
 * const config = getEnvConfig();
 * const nodeEnv = config.nodeEnv;
 *
 * // ✅ Good - not property access
 * const env = 'production';
 * const envConfig = { env: 'development' };
 */

const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow direct access to properties on 'env' variables",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      noEnvAccess:
        "Direct access to env properties is not allowed. Use a configuration object or environment validation instead.",
    },
    schema: [], // No options
  },

  create(context) {
    return {
      MemberExpression(node) {
        // Check if we're accessing a property on a variable named 'env'
        if (
          node.object &&
          node.object.type === "Identifier" &&
          node.object.name === "env" &&
          node.computed === false // Only flag dot notation, not bracket notation
        ) {
          // Don't flag if this member expression itself is being called as a function
          // e.g., env.call(), env.apply(), but do flag env.NODE_ENV.toLowerCase()
          const isDirectMethodCall =
            node.parent &&
            node.parent.type === "CallExpression" &&
            node.parent.callee === node;

          if (!isDirectMethodCall) {
            context.report({
              node,
              messageId: "noEnvAccess",
            });
          }
        }
      },
    };
  },
};

export default rule;
