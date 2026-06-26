// Fixture for @typescript-eslint/prefer-enum-initializers.
//
// Enum members with explicit string initializers are safe to reorder or
// extend without accidentally changing any value — the rule must not flag
// these.

export enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}
