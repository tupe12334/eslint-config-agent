import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { RuleTester } from 'eslint'
import { requireSpecFileTsxRule } from './index.js'

/**
 * Test suite for the require-spec-file-tsx rule.
 *
 * The rule checks the real filesystem for a sibling `<name>.spec.<ext>` (or
 * `.test.<ext>`) file, so the cases below point `filename` at the fixtures in
 * `examples/`. The component source is supplied inline via `code`; only the
 * sibling spec/test files need to exist on disk.
 */

const __dirname = dirname(fileURLToPath(import.meta.url))
const valid = name => join(__dirname, 'examples', 'valid', name)
const invalid = name => join(__dirname, 'examples', 'invalid', name)

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: (await import('@typescript-eslint/parser')).default,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
})

const componentCode = `
  export function Widget() {
    return <div className="widget">hi</div>
  }
`
const arrowComponentCode = `
  export const LonelyArrow = () => {
    const x = compute()
    return <div className="a">{x}</div>
  }
`

ruleTester.run('require-spec-file-tsx', requireSpecFileTsxRule, {
  valid: [
    // .tsx component with a sibling .spec.tsx
    { code: componentCode, filename: valid('Widget.tsx') },
    // .jsx component satisfied by a sibling .spec.jsx
    {
      code: `export function Panel() { return <section className="p">x</section> }`,
      filename: valid('Panel.jsx'),
    },
    // index files are excluded by default
    {
      code: `export const Thing = () => { return doWork() }`,
      filename: valid('index.tsx'),
    },
    // A spec file never needs its own spec
    {
      code: componentCode,
      filename: valid('Widget.spec.tsx'),
    },
    // .ts/.js files are left to ddd/require-spec-file, not this rule
    {
      code: `export function compute() { return 1 + 1 }`,
      filename: invalid('not-jsx.ts'),
    },
    // No logic -> no spec required (pure re-export)
    {
      code: `export { Widget } from './Widget'`,
      filename: invalid('barrel.tsx'),
    },
    // Excluded via explicit option
    {
      code: componentCode,
      filename: invalid('Lonely.tsx'),
      options: [{ excludePatterns: ['**/Lonely.tsx'] }],
    },
  ],
  invalid: [
    // .tsx component with no sibling spec/test
    {
      code: componentCode,
      filename: invalid('Lonely.tsx'),
      errors: [{ messageId: 'missingSpecFile' }],
    },
    // .jsx arrow component with logic and no sibling spec/test
    {
      code: arrowComponentCode,
      filename: invalid('LonelyArrow.jsx'),
      errors: [{ messageId: 'missingSpecFile' }],
    },
    // A `.test.tsx` sibling does NOT satisfy the requirement (only `.spec.*`
    // counts, matching ddd/require-spec-file).
    {
      code: componentCode,
      filename: invalid('OnlyTest.tsx'),
      errors: [{ messageId: 'missingSpecFile' }],
    },
  ],
})

// eslint-plugin RuleTester runs synchronously on definition; reaching here means
// every case passed.
export const requireSpecFileTsxSpecPassed = true
