// Both numeric `.sort()` calls below omit the compare function, so they sort
// lexicographically and return the numbers in the wrong order.
// require-array-sort-compare must flag each one.
export const sortPair = (left: number[], right: number[]): number[][] => [
  left.sort(),
  right.sort(),
]
