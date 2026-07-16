// Valid fixture for `@typescript-eslint/no-use-before-define`: the mirror of
// the invalid file, plus the one case the rule intentionally allows.
//
// `describeRate` calls `formatRate` before its textual definition — safe
// because function declarations are fully hoisted (including their body) and
// `functions: false` exempts them from this rule. `taxRate` is also declared
// before use, so neither reference hits the Temporal Dead Zone. Single
// export, no other rule noise.

const taxRate = 0.17

export const describeRate = (): string => formatRate(taxRate)

function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(0)}%`
}
