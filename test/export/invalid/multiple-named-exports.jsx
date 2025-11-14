// Test: Multiple named exports in one statement (should be invalid)
const functionA = () => 'A'
const functionB = () => 'B'

export { functionA, functionB }
