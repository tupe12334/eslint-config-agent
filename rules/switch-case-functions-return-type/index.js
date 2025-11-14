/**
 * Switch Case Functions Return Type Rule
 *
 * Enforces explicit return type annotations for functions defined within switch cases.
 * This rule ensures that arrow functions and function expressions inside switch cases
 * have clear return type contracts.
 */

export const switchCaseFunctionsReturnTypeConfigs = [
  {
    selector:
      'SwitchStatement > SwitchCase ArrowFunctionExpression:not([returnType])',
    message:
      'Switch case arrow functions must have explicit return type annotations.',
  },
  {
    selector:
      'SwitchStatement > SwitchCase FunctionExpression:not([returnType])',
    message:
      'Switch case function expressions must have explicit return type annotations.',
  },
  {
    selector:
      'SwitchStatement > SwitchCase > BlockStatement ArrowFunctionExpression:not([returnType])',
    message:
      'Switch case arrow functions must have explicit return type annotations.',
  },
  {
    selector:
      'SwitchStatement > SwitchCase > BlockStatement FunctionExpression:not([returnType])',
    message:
      'Switch case function expressions must have explicit return type annotations.',
  },
]
