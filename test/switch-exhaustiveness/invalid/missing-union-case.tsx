// Fixture for `@typescript-eslint/switch-exhaustiveness-check`.
//
// `Shape` is a closed string-literal union. The switch below handles only two
// of its three members, so the rule must flag the switch as non-exhaustive
// (there is no `default` branch to fall back on — and this config bans default
// cases anyway). Adding a fourth member to `Shape` later would likewise leave
// this switch silently incomplete, which is exactly what the rule guards
// against.

type Shape = 'circle' | 'square' | 'triangle'

/**
 * Maps a shape to the number of sides it has.
 * @param shape The shape to measure.
 * @returns The side count.
 */
export function sideCount(shape: Shape): number {
  switch (shape) {
    case 'circle':
      return 0

    case 'square':
      return 4
  }
  return -1
}
