// Test file that should fail - inline union types in function parameters should be restricted

// This should trigger the union type restriction error
function invalidFunction(param: string | number) {
  return param;
}

interface InvalidInterface {
  // This should also trigger the error
  method(arg: boolean | string): void;
}

export { invalidFunction, InvalidInterface };