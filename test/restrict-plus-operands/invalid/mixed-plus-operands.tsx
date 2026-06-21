// Fixture for `@typescript-eslint/restrict-plus-operands`.
//
// `count` is a `number` and `label` is a `string`. Joining them with `+` mixes
// a number and a string operand, which silently coerces the number to a string
// (`3 + 'x'` becomes `"3x"`) — a plausible-but-wrong value the type checker
// accepts because `+` is overloaded for both numbers and strings. The rule must
// flag the mismatched `+`. This complements `prefer-template` and
// `no-useless-concat`, which the config already ships: those govern string
// *literals* inside a `+`, this governs the operand *types*.

/**
 * Joins a numeric count and a text label by adding them with `+`.
 * @param count The numeric count.
 * @param label The text label.
 * @returns The coerced concatenation of the two operands.
 */
export function joinCountLabel(count: number, label: string): string {
  return count + label
}
