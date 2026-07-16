/**
 * Custom ESLint rule: require-spec-file-tsx
 *
 * Require a sibling spec/test file next to every `.tsx`/`.jsx` source file
 * that contains logic (a component, hook, or any function/class with a body).
 *
 * Why this rule exists: the shared config already enforces
 * `ddd/require-spec-file`, but the upstream `eslint-plugin-ddd` rule only
 * inspects `.js`/`.ts` files — it bails out on any other extension. That
 * silently exempts `.tsx`/`.jsx` files, i.e. the React/Preact components this
 * config primarily targets. This rule covers the JSX extensions with the same
 * heuristic, leaving `.js`/`.ts` to the `ddd` plugin.
 *
 * A file satisfies the rule when a sibling `<name>.spec.<ext>` exists in the
 * same directory. As with `ddd/require-spec-file`, only the `.spec.*` name
 * counts; a `.test.*` sibling is still skipped from needing its own spec but
 * does not satisfy the requirement for the source file.
 */

import { existsSync } from 'node:fs'
import { parse as parsePath, join as joinPath } from 'node:path'
import {
  JSX_EXTENSIONS,
  hasLogicInNode,
  checkExcludePatterns,
  DEFAULT_EXCLUDE_PATTERNS,
} from './helpers.js'

export const requireSpecFileTsxRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require a sibling spec/test file for .tsx/.jsx files with logic',
      category: 'Best Practices',
    },
    messages: {
      missingSpecFile:
        'Missing spec file: "{{specFile}}" should exist alongside this file.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          excludePatterns: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Glob patterns to exclude from the spec-file requirement',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {}
    const excludePatterns = options.excludePatterns || DEFAULT_EXCLUDE_PATTERNS

    let hasLogic = false
    const markLogic = node => {
      if (hasLogicInNode(node)) {
        hasLogic = true
      }
    }

    return {
      FunctionDeclaration: markLogic,
      FunctionExpression: markLogic,
      ArrowFunctionExpression: markLogic,
      ClassDeclaration: markLogic,
      ClassExpression: markLogic,

      'Program:exit'(node) {
        const filename = context.filename || context.getFilename()
        const normalized = filename.replaceAll('\\', '/')
        const parsed = parsePath(normalized)
        const extension = JSX_EXTENSIONS.find(candidate =>
          normalized.endsWith(candidate)
        )

        if (!extension) {
          return
        }
        // A spec/test file never needs its own spec.
        if (parsed.name.endsWith('.spec') || parsed.name.endsWith('.test')) {
          return
        }
        if (!hasLogic || checkExcludePatterns(normalized, excludePatterns)) {
          return
        }

        const specFileName = `${parsed.name}.spec${extension}`
        const hasSibling = existsSync(joinPath(parsed.dir, specFileName))

        if (!hasSibling) {
          context.report({
            node,
            messageId: 'missingSpecFile',
            data: { specFile: specFileName },
          })
        }
      },
    }
  },
}

export default requireSpecFileTsxRule
