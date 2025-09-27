/**
 * Switch Statements Return Type Rule
 *
 * Enforces explicit return type annotations for functions containing switch statements.
 * This rule ensures that functions with switch statements have clear return type contracts.
 */

export const switchStatementsReturnTypeConfigs = [
  {
    selector: "FunctionDeclaration:has(SwitchStatement):not([returnType])",
    message: "Functions containing switch statements must have explicit return type annotations.",
  },
  {
    selector: "ArrowFunctionExpression:has(SwitchStatement):not([returnType])",
    message: "Arrow functions containing switch statements must have explicit return type annotations.",
  },
  {
    selector: "FunctionExpression:has(SwitchStatement):not([returnType])",
    message: "Function expressions containing switch statements must have explicit return type annotations.",
  },
];