// Valid fixture for `@typescript-eslint/no-loop-func`: the mirror of the invalid
// file. Each closure captures a fresh, per-iteration binding instead of a
// variable the loop reassigns, so no closure can read another iteration's value
// and the rule must stay silent. A block-scoped `const runningTotal` is computed
// per iteration and captured by the pushed closure; nothing it closes over
// changes after the closure is created. Single export, no other rule noise.

export const buildAccumulators = (counts: number[]): (() => number)[] => {
  const accumulators: (() => number)[] = []
  let total = 0
  for (const count of counts) {
    total = total + count
    const runningTotal = total
    accumulators.push(() => runningTotal)
  }
  return accumulators
}
