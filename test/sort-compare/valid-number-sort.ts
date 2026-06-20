// A numeric sort with an explicit compare function is correct, and a plain
// string sort relies on the intended lexicographic order, so
// require-array-sort-compare (ignoreStringArrays: true) must stay silent here.
export const sortValues = (
  nums: number[],
  labels: string[]
): (number | string)[][] => [nums.sort((a, b) => a - b), labels.sort()]
