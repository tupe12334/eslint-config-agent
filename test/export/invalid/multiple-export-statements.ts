// Test: Multiple separate export {} statements (should be invalid)
const functionA = () => 'A';
const functionB = () => 'B';
const functionC = () => 'C';

export { functionA };
export { functionB };
export { functionC };