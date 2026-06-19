import assert from 'assert'
import {
  JSX_EXTENSIONS,
  hasLogicInNode,
  checkExcludePatterns,
  DEFAULT_EXCLUDE_PATTERNS,
} from './helpers.js'

/**
 * Unit tests for the require-spec-file-tsx helpers. Run standalone by the test
 * runner; any failed assertion throws and fails the suite.
 */

// JSX_EXTENSIONS only covers the JSX extensions; .js/.ts stay with ddd.
assert.deepStrictEqual(JSX_EXTENSIONS, ['.tsx', '.jsx'])

// hasLogicInNode: a function declaration with a body has logic.
assert.strictEqual(
  hasLogicInNode({ type: 'FunctionDeclaration', body: {} }),
  true
)

// hasLogicInNode: an arrow returning a bare literal has no logic.
assert.strictEqual(
  hasLogicInNode({
    type: 'ArrowFunctionExpression',
    body: { type: 'Literal' },
  }),
  false
)

// hasLogicInNode: an arrow returning JSX (non-simple body) has logic.
assert.strictEqual(
  hasLogicInNode({
    type: 'ArrowFunctionExpression',
    body: { type: 'JSXElement' },
  }),
  true
)

// hasLogicInNode: a class with a method body has logic.
assert.strictEqual(
  hasLogicInNode({
    type: 'ClassDeclaration',
    body: { body: [{ type: 'MethodDefinition', value: { body: {} } }] },
  }),
  true
)

// hasLogicInNode: null / non-logic nodes return false.
assert.strictEqual(hasLogicInNode(null), false)
assert.strictEqual(hasLogicInNode({ type: 'VariableDeclaration' }), false)

// checkExcludePatterns: index files and stories are excluded by default.
assert.strictEqual(
  checkExcludePatterns('src/components/index.tsx', DEFAULT_EXCLUDE_PATTERNS),
  true
)
assert.strictEqual(
  checkExcludePatterns(
    'src/components/Button.stories.tsx',
    DEFAULT_EXCLUDE_PATTERNS
  ),
  true
)

// checkExcludePatterns: a regular component is not excluded.
assert.strictEqual(
  checkExcludePatterns('src/components/Button.tsx', DEFAULT_EXCLUDE_PATTERNS),
  false
)

// checkExcludePatterns: directory-style patterns match by path segment.
assert.strictEqual(
  checkExcludePatterns('src/errors/AppError.tsx', ['**/errors/**']),
  true
)

export const helpersSpecPassed = true
