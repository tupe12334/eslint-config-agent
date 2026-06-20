import { noExplicitAnyConfig } from './no-explicit-any/index.js'

export const typescriptEslintRules = {
  ...noExplicitAnyConfig,
  '@typescript-eslint/consistent-type-assertions': 'off',
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  // Force `import type { ... }` for imports used only as types. A type-only
  // import is erased at compile time, so writing it as a value import leaves a
  // binding that looks like a runtime dependency: it can pull a module (and its
  // side effects) into the emitted JS even though nothing actually uses the
  // value, and it breaks under TypeScript's `verbatimModuleSyntax` /
  // `isolatedModules`. Making the type/value split explicit keeps the emitted
  // graph honest and the intent of every import legible — squarely in line with
  // this config's explicit-over-clever stance. It is exactly the distinction an
  // AI assistant blurs when it merges a type and a value into one import line.
  // The rule is auto-fixable (`eslint --fix`), so adoption is cheap; this is
  // why several downstream repos already re-add it by hand on top of the base
  // config. `fixStyle: 'separate-type-imports'` keeps type and value imports on
  // distinct statements rather than the inline `import { type X }` form.
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
  ],
}
