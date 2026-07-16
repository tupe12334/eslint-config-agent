// Fixture for @typescript-eslint/prefer-enum-initializers.
//
// Enum members without explicit initializers rely on implicit numeric
// assignment (0, 1, 2, ...). Reordering members or inserting a new one
// silently changes every subsequent member's numeric value — the rule must
// flag each member that has no initializer.

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}
