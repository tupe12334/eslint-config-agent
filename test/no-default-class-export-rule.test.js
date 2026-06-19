/**
 * Unit test for the custom `custom/no-default-class-export` rule shipped by
 * eslint-config-agent (rules/no-default-class-export).
 *
 * This rule is enabled as an error for TypeScript files (see configs/typescript.js
 * and configs/tsx.js) and is one of the few rules in this package that ships its
 * own `create()` implementation with an auto-fix. An auto-fixer that emits broken
 * code is worse than no rule at all, so this test pins down both the detection
 * (rule id + message id) and the exact text the fixer produces for named,
 * anonymous, `extends`, and class-expression default exports — and confirms the
 * legal named-export forms stay clean.
 *
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import { noDefaultClassExportRule } from '../rules/no-default-class-export/index.js'

// Isolate the custom rule so the assertions describe this rule's behavior alone,
// independent of the rest of the shipped config and of TypeScript project setup.
// The rule is purely syntactic (it only inspects ExportDefaultDeclaration), so a
// plain ESM JavaScript document exercises it exactly as it runs on .ts/.tsx code.
const baseOverride = {
  plugins: {
    custom: { rules: { 'no-default-class-export': noDefaultClassExportRule } },
  },
  languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: { 'custom/no-default-class-export': 'error' },
}

const checker = new ESLint({
  overrideConfigFile: true,
  overrideConfig: baseOverride,
})
const fixer = new ESLint({
  overrideConfigFile: true,
  overrideConfig: baseOverride,
  fix: true,
})

const messagesFor = async code => {
  const [result] = await checker.lintText(code, {
    filePath: 'no-default-class-export-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'custom/no-default-class-export'
  )
}

const fixedOutput = async code => {
  const [result] = await fixer.lintText(code, {
    filePath: 'no-default-class-export-sample.js',
  })
  return result.output
}

console.log('Testing custom/no-default-class-export rule...')

// 1. A named default class export must be flagged as an error with the
//    declaration message id.
const namedClass = await messagesFor('export default class Foo {}\n')
assert.strictEqual(
  namedClass.length,
  1,
  'Expected a named default class export to be flagged exactly once'
)
assert.strictEqual(
  namedClass[0].severity,
  2,
  'no-default-class-export should be an error'
)
assert.strictEqual(
  namedClass[0].messageId,
  'noDefaultClassDeclaration',
  'Named default class should use the noDefaultClassDeclaration message id'
)

// 2. The auto-fix must rewrite a named default class to a named export, keeping
//    the class name and body intact.
assert.strictEqual(
  await fixedOutput('export default class Foo {}\n'),
  'export class Foo {}\n',
  'Named default class export should be fixed to a named export'
)

// 3. An anonymous default class export must still be flagged and fixed, falling
//    back to the placeholder `ClassName` identifier.
const anonClass = await messagesFor('export default class {}\n')
assert.strictEqual(
  anonClass.length,
  1,
  'Expected an anonymous default class export to be flagged'
)
assert.strictEqual(
  anonClass[0].messageId,
  'noDefaultClassDeclaration',
  'Anonymous default class should use the noDefaultClassDeclaration message id'
)
assert.strictEqual(
  await fixedOutput('export default class {}\n'),
  'export class ClassName {}\n',
  'Anonymous default class export should be fixed to a named export named ClassName'
)

// 4. The fixer must preserve an `extends` clause.
assert.strictEqual(
  await fixedOutput('export default class Foo extends Bar {}\n'),
  'export class Foo extends Bar {}\n',
  'The fixer should preserve the superclass when rewriting the export'
)

// 5. A default class *expression* (distinct AST node) must be flagged with its
//    own message id and fixed to a named declaration.
const classExpr = await messagesFor('export default (class Foo {})\n')
assert.strictEqual(
  classExpr.length,
  1,
  'Expected a default class expression to be flagged'
)
assert.strictEqual(
  classExpr[0].messageId,
  'noDefaultClassExpression',
  'Default class expression should use the noDefaultClassExpression message id'
)

// 6. Legal forms must stay clean: a named class export and a non-class default
//    export must not be flagged by this rule.
const namedExport = await messagesFor('export class Foo {}\n')
assert.strictEqual(
  namedExport.length,
  0,
  'A named class export must not be flagged'
)

const valueDefault = await messagesFor(
  'const value = 1\nexport default value\n'
)
assert.strictEqual(
  valueDefault.length,
  0,
  'A non-class default export must not be flagged'
)

console.log('✅ All tests passed!')
