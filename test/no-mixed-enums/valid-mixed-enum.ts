// Fixture for @typescript-eslint/no-mixed-enums.
//
// An enum that uses exclusively string values must not be flagged — only
// homogeneous enums (all strings or all numbers) are allowed.

export enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}
