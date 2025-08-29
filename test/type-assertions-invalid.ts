// Test file for INVALID type assertion usage
// This file should trigger @typescript-eslint/consistent-type-assertions errors
// All 'as' usage except 'as const' should be flagged as errors

interface User {
  name: string;
  age: number;
}

// ❌ INVALID: Regular type assertions should be errors
function invalidAssertions() {
  const someValue: unknown = 'test string';
  
  // This should trigger consistent-type-assertions error
  const str = someValue as string;
  
  // This should trigger consistent-type-assertions error  
  const num = someValue as number;
  
  // This should trigger consistent-type-assertions error
  const user = someValue as User;
  
  // This should trigger both no-explicit-any and consistent-type-assertions errors
  const anyValue = someValue as any;
  
  // This should trigger consistent-type-assertions error
  const element = document.getElementById('test') as HTMLInputElement;
  
  return { str, num, user, anyValue, element };
}

// ❌ INVALID: Type assertion in function parameters
function processData(input: unknown) {
  // This should trigger consistent-type-assertions error
  return (input as User).name;
}

// ❌ INVALID: Chained type assertions
function chainedAssertions(value: unknown) {
  // This should trigger consistent-type-assertions error
  return ((value as any) as User).name;
}

// ❌ INVALID: Type assertion with interfaces
interface ApiData {
  id: number;
  title: string;
}

function parseApiResponse(response: unknown) {
  // This should trigger consistent-type-assertions error
  const data = response as ApiData;
  return data.title;
}

export {
  invalidAssertions,
  processData,
  chainedAssertions,
  parseApiResponse,
};