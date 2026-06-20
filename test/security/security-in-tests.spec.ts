// Fixture: the noisy `eslint-plugin-security` heuristics must be relaxed for
// test files. Both statements below trigger a `security/*` error under the
// strict source-file config (where `security/detect-object-injection` and
// `security/detect-non-literal-regexp` are set to `error`); inside a `*.spec.ts`
// the same code must lint clean.
//
// Only the two rules that need no runtime/node types to demonstrate are
// exercised here — `detect-object-injection` (the single noisiest security
// false-positive) and `detect-non-literal-regexp`. The same test-file override
// also relaxes `detect-non-literal-fs-filename`, `detect-child-process` and
// `detect-non-literal-require`, which require real `fs`/`child_process`
// bindings (and `@types/node`) to trip and so are left out of this fixture.
//
// JSDoc is intentionally omitted — `jsdoc/require-jsdoc` is already off for
// test files.
const lookup: Record<string, number> = { alpha: 1, beta: 2 }

// security/detect-object-injection: indexing a lookup table by a dynamic key,
// exactly how table-driven tests read their expected values.
function readEntry(key: string): number {
  return lookup[key]
}

// security/detect-non-literal-regexp: compiling a matcher from a test input.
function buildMatcher(pattern: string): RegExp {
  return new RegExp(pattern)
}

// Reference the helpers so they read as real test code rather than dead snippets.
export const securityFixtures = { readEntry, buildMatcher }
