#!/usr/bin/env node
/* eslint-disable max-lines, max-lines-per-function, security/detect-non-literal-fs-filename, security/detect-object-injection, default/no-default-params, import/order, unicorn/prevent-abbreviations, unicorn/try-complexity, no-await-in-loop, unicorn/no-array-sort, unicorn/prefer-top-level-await */

import { ESLint } from 'eslint'
import { join } from 'node:path'
import { readdir, stat } from 'node:fs/promises'
import { spawn } from 'node:child_process'

const __filename = import.meta.filename
const __dirname = import.meta.dirname
const projectRoot = join(__dirname, '..')

// Test categories and their expected behaviors
const testCategories = {
  valid: {
    description: 'Files that should have minimal or no errors',
    files: [
      'test/valid.tsx',
      'test/preact-test.tsx',
      'test/typescript-rules.ts',
      'test/type-assertions/indexed-access-valid.ts',
    ],
    maxErrors: 11,
    maxWarnings: 10,
  },
  invalid: {
    description: 'Files that should trigger specific errors',
    files: ['test/invalid.tsx', 'test/jsx-extension-test.js'],
    maxErrors: 11,
    maxWarnings: 6,
    expectedRules: [
      'no-restricted-syntax',
      'react/jsx-filename-extension',
      'jsx-classname/require-classname',
      '@typescript-eslint/no-explicit-any',
    ],
  },
  'type-assertions-indexed': {
    description: 'Indexed access type assertion restrictions',
    files: ['test/type-assertions/indexed-access-invalid.ts'],
    maxErrors: 10,
    maxWarnings: 0,
    expectedRules: ['no-restricted-syntax'],
  },
  warnings: {
    description: 'Files that should trigger warnings',
    files: ['test/lines/function-lines/long-function-test.tsx'],
    maxErrors: 6,
    maxWarnings: 5,
    expectedRules: ['max-lines-per-function', 'no-restricted-syntax'],
  },
  hooks: {
    description: 'React hooks rules testing',
    files: ['test/react-hooks-rules.tsx'],
    maxErrors: 66,
    maxWarnings: 20,
    expectedRules: [
      'react-hooks/exhaustive-deps',
      'react-hooks/rules-of-hooks',
    ],
  },
  imports: {
    description: 'Import/export patterns testing',
    files: ['test/import-export-rules.ts'],
    maxErrors: 33, // import/group-exports + import/no-namespace + import/first + import/no-duplicates + export specifier rules + early-return + @typescript-eslint/no-shadow + unused-imports/no-unused-imports (fixture imports symbols solely to exercise import grouping/ordering, leaving them unused)
    maxWarnings: 0,
    expectedRules: [
      'import/group-exports',
      'import/no-namespace',
      'import/first',
      '@typescript-eslint/no-shadow',
      'import/no-duplicates',
      'unused-imports/no-unused-imports',
    ],
  },
  'import-hygiene-invalid': {
    description: 'Duplicate imports and mutable exports should be flagged',
    files: [
      'test/import-hygiene/invalid/duplicate-imports.ts',
      'test/import-hygiene/invalid/mutable-export.ts',
    ],
    maxErrors: 5,
    maxWarnings: 0,
    expectedRules: ['import/no-duplicates', 'import/no-mutable-exports'],
  },
  'import-hygiene-valid': {
    description: 'Merged imports and immutable exports should be clean',
    files: ['test/import-hygiene/valid/clean-imports.ts'],
    maxErrors: 1,
    maxWarnings: 0,
  },
  'import-cycle-invalid': {
    description: 'Circular and self imports should be flagged',
    files: [
      'test/import-cycle/invalid/module-a.ts',
      'test/import-cycle/invalid/module-b.ts',
      'test/import-cycle/invalid/self-import.ts',
    ],
    maxErrors: 3,
    maxWarnings: 0,
    expectedRules: ['import/no-cycle', 'import/no-self-import'],
  },
  'import-cycle-valid': {
    description: 'Acyclic one-directional imports should be clean',
    files: [
      'test/import-cycle/valid/leaf.ts',
      'test/import-cycle/valid/uses-leaf.ts',
    ],
    maxErrors: 0,
    maxWarnings: 0,
  },
  'import-empty-named-invalid': {
    description: 'Empty named import blocks should be flagged',
    files: ['test/import-empty-named/invalid/empty-named-block.ts'],
    maxErrors: 3,
    maxWarnings: 0,
    expectedRules: ['import/no-empty-named-blocks'],
  },
  'import-empty-named-valid': {
    description: 'Named imports with bindings should be clean',
    files: ['test/import-empty-named/valid/clean.ts'],
    maxErrors: 1,
    maxWarnings: 0,
  },
  'import-useless-path-invalid': {
    description: 'Redundant relative path segments should be flagged',
    files: ['test/import-useless-path/invalid/redundant-segments.ts'],
    maxErrors: 1,
    maxWarnings: 0,
    expectedRules: ['import/no-useless-path-segments'],
  },
  'import-useless-path-valid': {
    description: 'Collapsed relative import paths should be clean',
    files: [
      'test/import-useless-path/valid/clean-path.ts',
      'test/import-useless-path/valid/target.ts',
    ],
    maxErrors: 0,
    maxWarnings: 0,
  },
  'security-in-tests': {
    description:
      'Noisy eslint-plugin-security heuristics are relaxed for test/spec files',
    files: ['test/security/security-in-tests.spec.ts'],
    maxErrors: 0,
    maxWarnings: 0,
  },
  'no-script-url-invalid': {
    description: 'A `javascript:` URL string should be flagged',
    files: ['test/no-script-url/invalid/script-url.ts'],
    maxErrors: 1,
    maxWarnings: 0,
    expectedRules: ['no-script-url'],
  },
  'no-script-url-valid': {
    description: 'An ordinary URL string should be clean',
    files: ['test/no-script-url/valid/clean-url.ts'],
    maxErrors: 0,
    maxWarnings: 0,
  },
  'edge-cases': {
    description: 'Edge cases and boundary testing',
    files: ['test/edge-cases.tsx'],
    // 22 jsx-classname/require-classname + 7 @typescript-eslint/no-unsafe-return
    // + 4 no-else-return + 1 each of @typescript-eslint/no-confusing-void-expression,
    // no-constant-binary-expression, @typescript-eslint/no-unnecessary-condition,
    // react/jsx-no-leaked-render, @typescript-eslint/no-shadow and
    // @typescript-eslint/no-explicit-any + unicorn rules.
    maxErrors: 47,
    maxWarnings: 30,
    expectedRules: [
      'no-restricted-syntax',
      'max-lines',
      '@typescript-eslint/no-explicit-any',
      '@typescript-eslint/no-shadow',
      'no-else-return',
      'no-lonely-if',
      'guard-clauses/prefer-guard-at-function-start',
      'guard-clauses/no-else-return',
      'guard-clauses/prefer-early-continue',
    ],
  },
  performance: {
    description: 'Performance and large file testing',
    files: ['test/performance-test.tsx'],
    maxErrors: 163,
    maxWarnings: 35,
    expectedRules: [
      'max-lines-per-function',
      'max-lines',
      'no-restricted-syntax',
      '@typescript-eslint/no-explicit-any',
      'error/no-generic-error',
      'error/require-custom-error',
      'guard-clauses/prefer-guard-at-function-start',
      'guard-clauses/no-else-return',
    ],
  },
  'export-valid': {
    description: 'Valid export patterns',
    files: [
      'test/export/valid/single-named-export.ts',
      'test/export/valid/single-function-export.ts',
      'test/export/valid/single-class-export.ts',
      'test/export/valid/single-interface-export.ts',
      'test/export/valid/single-type-export.ts',
      'test/export/valid/single-re-export.ts',
      'test/export/valid/single-type-re-export.ts',
      'test/export/valid/single-as-const-export.ts',
      'test/export/valid/multiple-re-exports.ts',
      'test/export/valid/jsx-component-with-props.jsx',
      'test/export/valid/tsx-component-with-props.tsx',
      'test/export/valid/tsx-component-with-type.tsx',
      'test/export/valid/tsx-class-component-with-props.tsx',
      'test/export/valid/tsx-multiple-individual-exports.tsx',
      'test/export/valid/tsx-export-statement.tsx',
      'test/export/valid/jsx-export-statement.jsx',
      'test/export/valid/export-type-re-export.ts',
      'test/export/valid/regular-type-export.ts',
      'test/export/valid/explicit-export-declaration.ts',
      'test/export/valid/export-from-scoped.ts',
    ],
    maxErrors: 26,
    maxWarnings: 5,
  },
  'export-invalid': {
    description: 'Invalid export patterns',
    files: [
      'test/export/invalid/default-export.ts',
      'test/export/invalid/default-class-export.ts',
      'test/export/invalid/multiple-named-exports.ts',
      'test/export/invalid/multiple-export-statements.ts',
      'test/export/invalid/two-export-statements.ts',
      'test/export/invalid/export-star.ts',
      'test/export/invalid/export-star-as.ts',
      'test/export/invalid/mixed-exports.ts',
      'test/export/invalid/default-with-named.ts',
      'test/export/invalid/export-type-local.ts',
      'test/export/invalid/regular-export-specifiers.ts',
      'test/export/invalid/default-as-export.ts',
      'test/export/invalid/export-of-import.ts',
      'test/export/invalid/export-from-lib.ts',
    ],
    maxErrors: 24, // class-export/class-export + remaining no-restricted-syntax + export specifier rules + single-export rules + early-return + unicorn rules
    maxWarnings: 0,
    expectedRules: [
      'no-restricted-syntax',
      'class-export/class-export',
      'single-export/single-export',
    ],
  },
  'index-files-valid': {
    description: 'Valid index file patterns',
    files: [
      'test/index-files/valid/index.ts',
      'test/index-files/valid/index-re-exports.ts',
    ],
    maxErrors: 0,
    maxWarnings: 2,
  },
  'index-files-invalid': {
    description: 'Invalid index file patterns',
    files: [
      'test/index-files/invalid/index.ts',
      'test/index-files/invalid/index-multiple-statements.ts',
      'test/index-files/invalid/index-export-specifiers.js',
    ],
    maxErrors: 7,
    maxWarnings: 2,
    expectedRules: ['no-restricted-syntax'],
  },
  'switch-case-valid': {
    description: 'Valid switch case patterns',
    files: [
      'test/switch-case/valid/explicit-returns.tsx',
      'test/switch-case/valid/typed-functions.tsx',
      'test/switch-case/valid/function-return-types.tsx',
    ],
    maxErrors: 31,
    maxWarnings: 0,
    expectedRules: [
      'switch-case/no-case-curly',
      'switch-case/newline-between-switch-case',
    ],
  },
  'switch-case-invalid': {
    description: 'Invalid switch case patterns',
    files: [
      'test/switch-case/invalid/default-cases.tsx',
      'test/switch-case/invalid/empty-returns.tsx',
      'test/switch-case/invalid/missing-function-return-types.tsx',
      'test/switch-case/invalid/untyped-functions.tsx',
    ],
    maxErrors: 94,
    maxWarnings: 0,
    expectedRules: [
      'no-restricted-syntax',
      'switch-case/no-case-curly',
      'switch-case/newline-between-switch-case',
    ],
  },
  'switch-exhaustiveness-invalid': {
    description: 'Non-exhaustive switch over a closed union must be flagged',
    files: ['test/switch-exhaustiveness/invalid/missing-union-case.tsx'],
    maxErrors: 5,
    maxWarnings: 0,
    expectedRules: ['@typescript-eslint/switch-exhaustiveness-check'],
  },
  'optional-chaining': {
    description: 'Optional chaining and nullish coalescing tests',
    files: ['test/test-optional.ts', 'test/test-js-optional.js'],
    maxErrors: 11,
    maxWarnings: 0,
    expectedRules: ['no-restricted-syntax'],
  },
  'classname-tests': {
    description: 'className attribute tests',
    files: [
      'test/classname-warning-test.tsx',
      'test/classname-warning-test.jsx',
    ],
    maxErrors: 62,
    maxWarnings: 0,
    expectedRules: ['jsx-classname/require-classname'],
  },
  'classname-valid': {
    description: 'Valid className usage - should have no errors',
    files: [
      'test/classname/valid/valid-classname.tsx',
      'test/classname/valid/valid-classname.jsx',
      'test/classname/valid/forms-fragments-valid.tsx',
      'test/classname/valid/react-components-valid.tsx',
    ],
    maxErrors: 35,
    maxWarnings: 0,
    expectedRules: ['jsx-classname/require-classname'],
  },
  'classname-invalid': {
    description: 'Invalid className usage - should trigger errors',
    files: [
      'test/classname/invalid/invalid-classname.tsx',
      'test/classname/invalid/invalid-classname.jsx',
      'test/classname/invalid/edge-cases-invalid.tsx',
      'test/classname/invalid/forms-fragments-invalid.tsx',
      'test/classname/invalid/react-components-invalid.tsx',
    ],
    maxErrors: 193,
    maxWarnings: 0,
    expectedRules: ['jsx-classname/require-classname'],
  },
  'spec-test-files': {
    description: 'Test and spec file patterns',
    files: [
      'test/lines/file-lines/max-lines-test-files.test.tsx',
      'test/lines/file-lines/max-lines-spec-files.spec.js',
    ],
    maxErrors: 12,
    maxWarnings: 0,
    expectedRules: [
      'no-undef',
      'max-lines-per-function',
      'max-lines',
      'no-restricted-syntax',
    ],
  },
  'record-literals': {
    description: 'Record literal type tests',
    files: ['test/test-record-literals.ts'],
    // 12 Record/any findings, plus one @typescript-eslint/consistent-type-exports
    // on the trailing value-export of the (type-only) names.
    maxErrors: 13,
    maxWarnings: 0,
    expectedRules: ['@typescript-eslint/no-explicit-any'],
  },
  'no-env-access': {
    description: 'n/no-process-env rule tests',
    files: ['test/no-env-access-test.ts'],
    maxErrors: 18,
    maxWarnings: 0,
    expectedRules: ['n/no-process-env'],
  },
  'mts-cts-coverage': {
    description:
      'ESM/CommonJS TypeScript (.mts/.cts) files get the TypeScript rule set',
    files: [
      'test/mts-cts/valid.mts',
      'test/mts-cts/valid.cts',
      'test/mts-cts/invalid.mts',
      'test/mts-cts/invalid.cts',
    ],
    maxErrors: 4,
    maxWarnings: 0,
    expectedRules: ['no-restricted-syntax'],
  },
  'mjs-cjs-coverage': {
    description:
      'ESM/CommonJS JavaScript (.mjs/.cjs) files get the JavaScript rule set',
    // The negative case uses `.cjs` rather than `.mjs`: the repo's lint-staged
    // glob is `*.{js,jsx,mjs}`, so an intentionally-invalid `.mjs` fixture would
    // trip the pre-commit hook (just as the `.mts/.cts` invalid fixtures avoid
    // it by not matching the glob). `.cjs` is linted here through the exported
    // config, proving the JavaScript rule set now applies to these extensions.
    files: [
      'test/mjs-cjs/valid.mjs',
      'test/mjs-cjs/valid.cjs',
      'test/mjs-cjs/invalid.cjs',
    ],
    maxErrors: 1,
    maxWarnings: 0,
    expectedRules: ['no-restricted-syntax'],
  },
  'require-array-sort-compare': {
    description:
      'Comparator-less numeric sorts are flagged; comparator and string-array sorts pass',
    files: [
      'test/sort-compare/invalid-number-sort.ts',
      'test/sort-compare/valid-number-sort.ts',
    ],
    maxErrors: 6,
    maxWarnings: 0,
    expectedRules: ['@typescript-eslint/require-array-sort-compare'],
  },
  'consistent-type-exports': {
    description:
      'A type-only re-export written as a value export must be flagged (use `export type`)',
    files: ['test/consistent-type-exports/invalid/value-export-of-type.ts'],
    maxErrors: 2,
    maxWarnings: 0,
    expectedRules: ['@typescript-eslint/consistent-type-exports'],
  },
  'return-await': {
    description:
      'A bare return-in-try and a redundant return-await are flagged; an awaited try-return and a bare return outside try pass',
    files: [
      'test/return-await/invalid-return-await.ts',
      'test/return-await/valid-return-await.ts',
    ],
    maxErrors: 3,
    maxWarnings: 0,
    expectedRules: ['@typescript-eslint/return-await'],
  },
  'no-loop-func': {
    description:
      'A closure created in a loop over a reassigned variable is flagged; capturing a fresh per-iteration const passes',
    files: [
      'test/no-loop-func/invalid-no-loop-func.ts',
      'test/no-loop-func/valid-no-loop-func.ts',
    ],
    maxErrors: 5,
    maxWarnings: 0,
    expectedRules: ['@typescript-eslint/no-loop-func'],
  },
  'no-misused-promises': {
    description:
      'An async callback passed to forEach (void-return context) is flagged; an explicit for...of with await passes',
    files: [
      'test/no-misused-promises/invalid-no-misused-promises.ts',
      'test/no-misused-promises/valid-no-misused-promises.ts',
    ],
    maxErrors: 5,
    maxWarnings: 0,
    expectedRules: ['@typescript-eslint/no-misused-promises'],
  },
  'prefer-enum-initializers-invalid': {
    description:
      'Enum members without explicit initializers must be flagged; one error per member',
    files: ['test/prefer-enum-initializers/invalid-implicit-enum.ts'],
    maxErrors: 4,
    maxWarnings: 0,
    expectedRules: ['@typescript-eslint/prefer-enum-initializers'],
  },
  'prefer-enum-initializers-valid': {
    description:
      'Enum members with explicit string initializers must not be flagged',
    files: ['test/prefer-enum-initializers/valid-explicit-enum.ts'],
    maxErrors: 0,
    maxWarnings: 0,
  },
  'no-useless-call-invalid': {
    description:
      '.call(null, ...) and .apply(undefined, [...]) with a null/undefined receiver must be flagged',
    files: ['test/no-useless-call/invalid-no-useless-call.ts'],
    maxErrors: 1,
    maxWarnings: 0,
    expectedRules: ['no-useless-call'],
  },
  'no-useless-call-valid': {
    description: 'Direct calls must not be flagged',
    files: ['test/no-useless-call/valid-no-useless-call.ts'],
    maxErrors: 0,
    maxWarnings: 0,
  },
  'no-mixed-enums-invalid': {
    description:
      'An enum that mixes numeric and string member values must be flagged',
    files: ['test/no-mixed-enums/invalid-mixed-enum.ts'],
    maxErrors: 1,
    maxWarnings: 0,
    expectedRules: ['@typescript-eslint/no-mixed-enums'],
  },
  'no-mixed-enums-valid': {
    description: 'Pure-string and pure-numeric enums must not be flagged',
    files: ['test/no-mixed-enums/valid-mixed-enum.ts'],
    maxErrors: 0,
    maxWarnings: 0,
  },
}

async function findTestFiles() {
  const files = []

  // Recursively check test/ directory
  async function scanDirectory(dirPath, relativePath) {
    try {
      const entries = await readdir(dirPath)

      for (const entry of entries) {
        const fullPath = join(dirPath, entry)
        const stats = await stat(fullPath)
        const relativeFilePath = join(relativePath, entry)

        // The `test/recommended/` directory holds fixtures for the relaxed
        // `recommended` preset, which intentionally disables several strict
        // rules (single-export, consistent-type-definitions, the
        // no-restricted-syntax bans, ...). Those fixtures must be linted with
        // the relaxed preset, not the strict default config this runner loads,
        // and they already have dedicated coverage in
        // `scripts/test-recommended.js` (the `test:recommended` script). If we
        // let the generic scan pick them up, they land in the catch-all
        // `auto-misc-tests` category (max 0 errors/warnings) and get linted
        // with the strict config, so the relaxed-away violations are reported
        // as errors and fail the whole suite. Skip the directory here.
        if (stats.isDirectory() && entry === 'recommended') {
          continue
        }

        if (
          stats.isFile() &&
          /\.(?:ts|tsx|js|jsx|mts|cts|mjs|cjs)$/.test(entry)
        ) {
          files.push(relativeFilePath)
        } else if (stats.isDirectory()) {
          await scanDirectory(fullPath, relativeFilePath)
        }
      }
    } catch (error) {
      console.warn(
        `⚠️  Could not read directory ${relativePath}:`,
        error.message
      )
    }
  }

  await scanDirectory(join(projectRoot, 'test'), 'test')

  // Scan rules directory for spec files only
  async function scanRulesForSpecs(rulesPath, relativePath) {
    try {
      const entries = await readdir(rulesPath)

      for (const entry of entries) {
        const fullPath = join(rulesPath, entry)
        const stats = await stat(fullPath)
        const relativeFilePath = join(relativePath, entry)

        if (stats.isFile() && entry.endsWith('.spec.js')) {
          files.push(relativeFilePath)
        } else if (stats.isDirectory() && !entry.includes('examples')) {
          await scanRulesForSpecs(fullPath, relativeFilePath)
        }
      }
    } catch (error) {
      console.warn(
        `⚠️  Could not read rules directory ${relativePath}:`,
        error.message
      )
    }
  }

  await scanRulesForSpecs(join(projectRoot, 'rules'), 'rules')

  // Check for specific test files in root directory
  const rootTestFiles = []
  for (const testFile of rootTestFiles) {
    const fullPath = join(projectRoot, testFile)
    try {
      const stats = await stat(fullPath)
      if (stats.isFile()) {
        files.push(testFile)
      }
    } catch {
      // File doesn't exist, skip
    }
  }

  return files.sort()
}

async function runTestCategory(eslint, category, config) {
  console.log(`\n📁 Testing category: ${category}`)
  console.log(`   ${config.description}`)

  let categoryPassed = true
  const categoryResults = {
    totalErrors: 0,
    totalWarnings: 0,
    rulesCovered: new Set(),
    fileResults: [],
  }

  for (const file of config.files) {
    const filePath = join(projectRoot, file)

    try {
      const results = await eslint.lintFiles([filePath])
      const result = results[0]

      if (result) {
        const errorCount = result.errorCount
        const warningCount = result.warningCount

        categoryResults.totalErrors += errorCount
        categoryResults.totalWarnings += warningCount
        categoryResults.fileResults.push({
          file,
          errors: errorCount,
          warnings: warningCount,
          messages: result.messages,
        })

        // Collect rules that were triggered
        for (const msg of result.messages) {
          if (msg.ruleId) {
            categoryResults.rulesCovered.add(msg.ruleId)
          }
        }

        console.log(
          `   📄 ${file}: ${errorCount} errors, ${warningCount} warnings`
        )

        // Show top errors/warnings for debugging
        if (result.messages.length > 0) {
          const topMessages = result.messages.slice(0, 3)
          for (const msg of topMessages) {
            const level = msg.severity === 2 ? '❌' : '⚠️ '
            console.log(
              `      ${level} Line ${msg.line}: ${msg.message} (${
                msg.ruleId || 'unknown'
              })`
            )
          }

          if (result.messages.length > 3) {
            console.log(
              `      ... and ${result.messages.length - 3} more issues`
            )
          }
        }
      }
    } catch (error) {
      console.error(`   ❌ Error linting ${file}:`, error.message)
      categoryPassed = false
    }
  }

  // Validate category expectations
  if (categoryResults.totalErrors > config.maxErrors) {
    console.log(
      `   ❌ Too many errors: ${categoryResults.totalErrors} > ${config.maxErrors}`
    )
    categoryPassed = false
  }

  if (categoryResults.totalWarnings > config.maxWarnings) {
    console.log(
      `   ❌ Too many warnings: ${categoryResults.totalWarnings} > ${config.maxWarnings}`
    )
    categoryPassed = false
  }

  // Check for expected rules
  if (config.expectedRules) {
    const missingRules = config.expectedRules.filter(
      rule => !categoryResults.rulesCovered.has(rule)
    )

    if (missingRules.length > 0) {
      console.log(`   ⚠️  Expected rules not found: ${missingRules.join(', ')}`)
    }

    if (categoryResults.rulesCovered.size > 0) {
      console.log(
        `   ✅ Rules covered: ${[...categoryResults.rulesCovered].join(', ')}`
      )
    }
  }

  const status = categoryPassed ? '✅' : '❌'
  console.log(
    `   ${status} Category result: ${categoryResults.totalErrors} errors, ${categoryResults.totalWarnings} warnings`
  )

  return { passed: categoryPassed, results: categoryResults }
}

async function runStandaloneTest(testFile) {
  console.log(`🧪 Running standalone test: ${testFile}`)

  return new Promise(resolve => {
    const child = spawn('node', [join(projectRoot, testFile)], {
      stdio: 'pipe',
      cwd: projectRoot,
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', data => {
      stdout += data.toString()
    })

    child.stderr.on('data', data => {
      stderr += data.toString()
    })

    child.on('close', code => {
      const passed = code === 0

      if (passed) {
        console.log(`   ✅ Test passed: ${testFile}`)
        // Show last line of stdout (usually success message)
        const lines = stdout.trim().split('\n')
        if (lines.length > 0) {
          console.log(`   📝 ${lines.at(-1)}`)
        }
      } else {
        console.log(`   ❌ Test failed: ${testFile} (exit code: ${code})`)
        if (stderr) {
          console.log(`   📝 Error: ${stderr.trim()}`)
        }
        if (stdout) {
          console.log(`   📝 Output: ${stdout.trim()}`)
        }
      }

      resolve({ passed, file: testFile })
    })

    child.on('error', error => {
      console.log(`   ❌ Failed to run test: ${testFile}`)
      console.log(`   📝 Error: ${error.message}`)
      resolve({ passed: false, file: testFile })
    })
  })
}

async function runStandaloneTests(testFiles) {
  if (testFiles.length === 0) return { passed: true, results: [] }

  console.log(`\n📁 Running ${testFiles.length} standalone test(s):`)
  const results = []

  for (const testFile of testFiles) {
    const result = await runStandaloneTest(testFile)
    results.push(result)
  }

  const allPassed = results.every(r => r.passed)
  const passedCount = results.filter(r => r.passed).length

  console.log(`   📊 Results: ${passedCount}/${results.length} tests passed`)

  return { passed: allPassed, results }
}

async function generateTestReport(allResults, standaloneResult = null) {
  console.log(`\n${'='.repeat(80)}`)
  console.log('📊 TEST REPORT SUMMARY')
  console.log('='.repeat(80))

  let overallPassed = true
  let totalErrors = 0
  let totalWarnings = 0
  const allRulesCovered = new Set()

  // Report ESLint category results
  for (const [category, { passed, results }] of Object.entries(allResults)) {
    const status = passed ? '✅' : '❌'
    console.log(
      `${status} ${category}: ${results.totalErrors} errors, ${results.totalWarnings} warnings`
    )

    if (!passed) overallPassed = false
    totalErrors += results.totalErrors
    totalWarnings += results.totalWarnings

    for (const rule of results.rulesCovered) {
      allRulesCovered.add(rule)
    }
  }

  // Report standalone test results
  if (standaloneResult && standaloneResult.results.length > 0) {
    const status = standaloneResult.passed ? '✅' : '❌'
    const passedCount = standaloneResult.results.filter(r => r.passed).length
    console.log(
      `${status} standalone-tests: ${passedCount}/${standaloneResult.results.length} tests passed`
    )

    if (!standaloneResult.passed) {
      overallPassed = false
    }
  }

  console.log('\n📋 Overall Statistics:')
  console.log(`   Total Errors: ${totalErrors}`)
  console.log(`   Total Warnings: ${totalWarnings}`)
  console.log(`   Rules Covered: ${allRulesCovered.size}`)
  console.log(`   Categories Tested: ${Object.keys(allResults).length}`)

  console.log('\n🔧 Rules Coverage:')
  const sortedRules = [...allRulesCovered].sort()
  for (let i = 0; i < sortedRules.length; i += 3) {
    const chunk = sortedRules.slice(i, i + 3)
    console.log(`   ${chunk.join(', ')}`)
  }

  console.log(`\n${'='.repeat(80)}`)

  if (overallPassed) {
    console.log('🎉 ALL TESTS PASSED!')
    return true
  }
  console.log('💥 SOME TESTS FAILED!')
  return false
}

function autoCategorizeFiles(allTestFiles) {
  const autoCategories = {}
  const uncategorizedFiles = []

  // First, assign files to predefined categories
  for (const [category, config] of Object.entries(testCategories)) {
    const existingFiles = config.files.filter(file =>
      allTestFiles.includes(file)
    )
    if (existingFiles.length > 0) {
      autoCategories[category] = { ...config, files: existingFiles }
    }
  }

  // Find files that aren't in any predefined category
  const categorizedFiles = new Set()
  for (const category of Object.values(autoCategories)) {
    for (const file of category.files) {
      categorizedFiles.add(file)
    }
  }

  for (const file of allTestFiles) {
    if (!categorizedFiles.has(file)) {
      uncategorizedFiles.push(file)
    }
  }

  // Auto-categorize uncategorized files based on path patterns
  if (uncategorizedFiles.length > 0) {
    const pathCategories = {
      'auto-export-tests': {
        description: 'Auto-discovered export-related tests',
        files: uncategorizedFiles.filter(
          file =>
            file.includes('/export/') ||
            file.includes('export') ||
            file.includes('Export')
        ),
        maxErrors: 57,
        maxWarnings: 2,
        expectedRules: ['no-restricted-syntax'],
      },
      'auto-component-tests': {
        description: 'Auto-discovered component tests',
        files: uncategorizedFiles.filter(
          file =>
            (file.includes('component') || file.includes('Component')) &&
            !file.includes('/export/')
        ),
        maxErrors: 5,
        maxWarnings: 15,
      },
      'auto-type-tests': {
        description: 'Auto-discovered type-related tests',
        files: uncategorizedFiles.filter(
          file =>
            (file.includes('type') ||
              file.includes('Type') ||
              file.includes('interface') ||
              file.includes('Interface')) &&
            !file.includes('/export/') &&
            !file.includes('component')
        ),
        maxErrors: 25,
        maxWarnings: 20,
        expectedRules: [
          'no-restricted-syntax',
          '@typescript-eslint/no-explicit-any',
        ],
      },
      'auto-misc-tests': {
        description: 'Auto-discovered miscellaneous tests',
        files: uncategorizedFiles.filter(
          file =>
            !file.includes('/export/') &&
            !file.includes('export') &&
            !file.includes('Export') &&
            !file.includes('component') &&
            !file.includes('Component') &&
            !file.includes('type') &&
            !file.includes('Type') &&
            !file.includes('interface') &&
            !file.includes('Interface')
        ),
        maxErrors: 0,
        maxWarnings: 0,
      },
    }

    // Add non-empty auto-categories
    for (const [category, config] of Object.entries(pathCategories)) {
      if (config.files.length > 0) {
        autoCategories[category] = config
      }
    }
  }

  return autoCategories
}

async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive ESLint Configuration Tests')
  console.log('='.repeat(60))

  try {
    // Initialize ESLint
    const eslint = new ESLint({
      overrideConfigFile: join(projectRoot, 'eslint.config.js'),
    })

    // Discover all test files
    const allTestFiles = await findTestFiles()
    console.log(`📁 Discovered ${allTestFiles.length} test files:`)
    for (const file of allTestFiles) {
      console.log(`   - ${file}`)
    }

    // Separate standalone test files from lint test files
    const standaloneTestFiles = allTestFiles.filter(
      file => file.endsWith('.test.js') || file.endsWith('.spec.js')
    )
    const lintTestFiles = allTestFiles.filter(
      file => !file.endsWith('.test.js') && !file.endsWith('.spec.js')
    )

    // Auto-categorize lint test files only (predefined + auto-discovered)
    const allCategories = autoCategorizeFiles(lintTestFiles)

    console.log(
      `\n📊 Test categories (${Object.keys(allCategories).length} total):`
    )
    for (const [category, config] of Object.entries(allCategories)) {
      const autoPrefix = category.startsWith('auto-') ? '🔍 ' : '📋 '
      console.log(
        `   ${autoPrefix}${category}: ${config.files.length} files - ${config.description}`
      )
    }

    // Run tests by category
    const allResults = {}

    // Run ESLint categories
    for (const [category, config] of Object.entries(allCategories)) {
      const result = await runTestCategory(eslint, category, config)
      allResults[category] = result
    }

    // Run standalone test files
    const standaloneResult = await runStandaloneTests(standaloneTestFiles)

    // Generate final report
    const overallPassed = await generateTestReport(allResults, standaloneResult)

    if (overallPassed) {
      process.exit(0)
    } else {
      process.exit(1)
    }
  } catch (error) {
    console.error('💥 Test runner failed:', error)
    process.exit(1)
  }
}

// Handle CLI arguments
const args = new Set(process.argv.slice(2))
const showHelp = args.has('--help') || args.has('-h')

if (showHelp) {
  console.log(`
ESLint Configuration Test Runner

Usage:
  node scripts/test-runner.js [options]

Options:
  -h, --help     Show this help message
  --verbose      Show detailed output
  --category     Run specific category only

Examples:
  node scripts/test-runner.js
  node scripts/test-runner.js --verbose
  node scripts/test-runner.js --category=hooks
  `)
  process.exit(0)
}

runComprehensiveTests()
