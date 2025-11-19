/**
 * Custom rule to detect error-only files
 *
 * Files that only export classes extending Error don't need spec files.
 * This rule detects such files and disables the ddd/require-spec-file rule.
 */

/**
 * Check if a class declaration extends Error or another Error class
 */
function extendsError(node) {
  if (!node.superClass) {
    return false
  }

  // Direct Error extension: class MyError extends Error
  if (node.superClass.name === 'Error') {
    return true
  }

  // Custom error extension: class MyError extends CustomError
  // We'll consider any class ending with 'Error' as an error class
  if (node.superClass.name && node.superClass.name.endsWith('Error')) {
    return true
  }

  return false
}

/**
 * Check if the file only contains error class exports
 */
function isErrorOnlyFile(context) {
  const sourceCode = context.sourceCode || context.getSourceCode()
  const ast = sourceCode.ast

  let hasExports = false
  let hasNonErrorExport = false
  let errorClassCount = 0

  // Analyze all nodes in the file
  for (const node of ast.body) {
    // Export class MyError extends Error {}
    if (node.type === 'ExportNamedDeclaration' && node.declaration) {
      hasExports = true

      if (node.declaration.type === 'ClassDeclaration') {
        if (extendsError(node.declaration)) {
          errorClassCount++
        } else {
          hasNonErrorExport = true
        }
      } else {
        // Non-class export (const, function, etc.)
        hasNonErrorExport = true
      }
    }
    // export default class MyError extends Error {}
    else if (node.type === 'ExportDefaultDeclaration') {
      hasExports = true

      if (
        node.declaration.type === 'ClassDeclaration' ||
        node.declaration.type === 'ClassExpression'
      ) {
        if (extendsError(node.declaration)) {
          errorClassCount++
        } else {
          hasNonErrorExport = true
        }
      } else {
        hasNonErrorExport = true
      }
    }
    // export { MyError }
    else if (
      node.type === 'ExportNamedDeclaration' &&
      node.specifiers.length > 0
    ) {
      // For export specifiers, we can't easily determine if they're error classes
      // without tracking variable declarations. For now, we'll be conservative
      // and not count these as error-only files.
      hasNonErrorExport = true
    }
    // Class declarations that might be exported elsewhere
    else if (node.type === 'ClassDeclaration') {
      // This is a class that's not directly exported
      // It might be exported via export { MyClass } later
      // We'll track this conservatively
    }
  }

  // File is error-only if:
  // 1. It has exports
  // 2. All exports are error classes
  // 3. It has at least one error class
  return hasExports && !hasNonErrorExport && errorClassCount > 0
}

export const errorOnlyExportsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        "Detects files that only export Error classes and suggests they don't need spec files",
      category: 'Best Practices',
      recommended: false,
    },
    messages: {
      errorOnlyFile:
        'This file only exports Error classes and does not require a spec file. Consider adding: /* eslint-disable ddd/require-spec-file */',
    },
    schema: [],
  },

  create(context) {
    return {
      Program() {
        // Only check on program exit to ensure we've seen all exports
      },
      'Program:exit'(node) {
        if (isErrorOnlyFile(context)) {
          // Check if the file already has the eslint-disable comment
          const sourceCode = context.sourceCode || context.getSourceCode()
          const comments = sourceCode.getAllComments()

          const hasDisableComment = comments.some(
            comment =>
              comment.value.includes('eslint-disable ddd/require-spec-file') ||
              comment.value.includes(
                'eslint-disable-next-line ddd/require-spec-file'
              )
          )

          // Only report if the disable comment is not present
          if (!hasDisableComment) {
            context.report({
              node,
              messageId: 'errorOnlyFile',
            })
          }
        }
      },
    }
  },
}

export default errorOnlyExportsRule
