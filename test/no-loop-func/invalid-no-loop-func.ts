// Invalid-by-design fixture for `@typescript-eslint/no-loop-func`. Exactly one
// no-loop-func violation, no other rule noise (single export; the loop variable
// is reassigned so the closure captures a binding that changes per iteration):
//
// The arrow `() => total` is created inside the `for` loop and closes over
// `total`, which the loop reassigns every iteration. Every closure shares the
// one `total` binding, so they all read its final value instead of the
// per-iteration value the code looks like it captures — the classic
// closure-over-a-mutated-loop-variable bug the rule exists to flag.

export const buildAccumulators = (counts: number[]): (() => number)[] => {
  const accumulators: (() => number)[] = []
  let total = 0
  for (const count of counts) {
    total = total + count
    accumulators.push(() => total)
  }
  return accumulators
}
