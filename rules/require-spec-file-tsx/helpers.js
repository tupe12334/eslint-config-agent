/* eslint-disable single-export/single-export */
// Helpers for the require-spec-file-tsx rule.
//
// Logic detection and pattern matching mirror eslint-plugin-ddd so the
// .tsx/.jsx half of the spec-file requirement behaves like the .js/.ts half.

export const JSX_EXTENSIONS = ['.tsx', '.jsx']

const FUNC_TYPES = new Set([
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
])

// Arrow bodies that are a bare value (not a block) and carry no real logic.
const SIMPLE_BODIES = new Set([
  'Literal',
  'Identifier',
  'ObjectExpression',
  'ArrayExpression',
])

// Whether a node introduces real logic that warrants a spec file.
export const hasLogicInNode = node => {
  if (!node) {
    return false
  }
  if (FUNC_TYPES.has(node.type) && node.body) {
    if (
      node.type === 'ArrowFunctionExpression' &&
      node.body.type !== 'BlockStatement'
    ) {
      return !SIMPLE_BODIES.has(node.body.type)
    }
    return true
  }
  if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') {
    return node.body.body.some(
      member =>
        member.type === 'MethodDefinition' && member.value && member.value.body
    )
  }
  return false
}

const checkSinglePattern = (filename, pattern) => {
  if (pattern.startsWith('**/') && pattern.endsWith('/**')) {
    return filename.includes(`/${pattern.slice(3, -3)}/`)
  }
  if (pattern.includes('**/')) {
    const suffix = pattern.replace('**/', '')
    if (suffix.startsWith('*')) {
      return filename.endsWith(suffix.slice(1))
    }
    if (suffix.includes('*')) {
      const basename = filename.split('/').pop()
      return suffix.split('*').every(part => basename.includes(part))
    }
    return filename.endsWith(`/${suffix}`)
  }
  return filename.includes(pattern)
}

// Test a filename against glob-ish exclude patterns, supporting the same
// double-star prefix and brace-expansion forms accepted by the ddd plugin.
export const checkExcludePatterns = (filename, excludePatterns) => {
  const normalized = filename.replaceAll('\\', '/')
  return excludePatterns.some(pattern => {
    const braceMatch = pattern.match(/\{(?<content>[^}]+)\}/)
    if (braceMatch) {
      return braceMatch.groups.content
        .split(',')
        .some(alt =>
          checkSinglePattern(normalized, pattern.replace(/\{[^}]+\}/, alt))
        )
    }
    return checkSinglePattern(normalized, pattern)
  })
}

export const DEFAULT_EXCLUDE_PATTERNS = [
  '**/index.tsx',
  '**/index.jsx',
  '**/*.stories.{tsx,jsx}',
  '**/*.d.ts',
  // Error/exception files mirror the ddd/require-spec-file exemptions so a
  // React/Preact error component (e.g. an error boundary) is treated the same
  // as its `.ts` counterpart instead of being singled out for a spec file.
  '**/*-error.{tsx,jsx}',
  '**/*.error.{tsx,jsx}',
  '**/errors/**',
  '**/exceptions/**',
]
