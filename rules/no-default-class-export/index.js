/**
 * Rule configuration for preventing default class exports
 *
 * This rule enforces named exports for classes instead of default exports
 * to improve code organization, import consistency, and tree-shaking.
 *
 * Default class exports can make it harder to:
 * - Track class usage across the codebase
 * - Perform refactoring and renaming operations
 * - Enable proper tree-shaking optimizations
 * - Maintain consistent import naming conventions
 */

/**
 * Custom ESLint rule that prevents default class exports and provides auto-fix
 */
export const noDefaultClassExportRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow default class exports in favor of named exports',
      category: 'Best Practices',
    },
    fixable: 'code',
    messages: {
      noDefaultClassDeclaration:
        "Default class exports are not allowed. Use named exports instead: 'export class {{className}} {}'.",
      noDefaultClassExpression:
        "Default class expressions are not allowed. Use named class declarations instead: 'export class ClassName {}'.",
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.getSourceCode()

    return {
      ExportDefaultDeclaration(node) {
        // Check if the default export is a class declaration
        if (node.declaration && node.declaration.type === 'ClassDeclaration') {
          const classDeclaration = node.declaration
          const className =
            (classDeclaration.id && classDeclaration.id.name) || 'ClassName'

          context.report({
            node: node,
            messageId: 'noDefaultClassDeclaration',
            data: {
              className: className,
            },
            fix(fixer) {
              // Handle anonymous classes
              if (!classDeclaration.id) {
                // Get class body and other parts
                const body = sourceCode.getText(classDeclaration.body)
                const superClass = classDeclaration.superClass
                  ? ` extends ${sourceCode.getText(classDeclaration.superClass)}`
                  : ''

                return fixer.replaceText(
                  node,
                  `export class ${className}${superClass} ${body}`
                )
              }

              // For named classes, just replace default with named export
              const classText = sourceCode.getText(classDeclaration)
              return fixer.replaceText(node, `export ${classText}`)
            },
          })
        }
        // Check if the default export is a class expression
        else if (
          node.declaration &&
          node.declaration.type === 'ClassExpression'
        ) {
          const classExpression = node.declaration
          const className =
            (classExpression.id && classExpression.id.name) || 'ClassName'

          context.report({
            node: node,
            messageId: 'noDefaultClassExpression',
            fix(fixer) {
              // Build the fixed class declaration
              const body = sourceCode.getText(classExpression.body)
              const superClass = classExpression.superClass
                ? ` extends ${sourceCode.getText(classExpression.superClass)}`
                : ''

              const newCode = `export class ${className}${superClass} ${body}`
              return fixer.replaceText(node, newCode)
            },
          })
        }
      },
    }
  },
}

/**
 * Backward compatibility: no-restricted-syntax configurations
 * (for use in existing rule arrays that don't support custom rules)
 */
export const noDefaultClassExportConfig = {
  selector: 'ExportDefaultDeclaration > ClassDeclaration',
  message:
    "Default class exports are not allowed. Use named exports instead: 'export class ClassName {}'.",
}

export const noDefaultClassExpressionConfig = {
  selector: 'ExportDefaultDeclaration > ClassExpression',
  message:
    "Default class expressions are not allowed. Use named class declarations instead: 'export class ClassName {}'.",
}

/**
 * Combined rule configurations for comprehensive default class export prevention
 */
export const noDefaultClassExportRules = [
  noDefaultClassExportConfig,
  noDefaultClassExpressionConfig,
]

// Default export for backward compatibility
export default noDefaultClassExportConfig

// Named exports for specific use cases
export {
  noDefaultClassExpressionConfig as noDefaultClassExpression,
  noDefaultClassExportRules as allNoDefaultClassExportRules,
}
