import React from 'react';

interface Props {
  name: string;
  age?: number;
}

function InvalidComponent({ name, age }: Props) {
  // This should trigger no-restricted-syntax error (optional chaining not allowed)
  const greeting = `Hello, ${name}!`;

  // This should trigger no-restricted-syntax error (nullish coalescing not allowed)
  const displayAge = age ?? 'unknown';

  // This should trigger no-restricted-syntax error (optional chaining not allowed)
  const result = age?.toString();

  // Another optional chaining test
  const nested = age?.valueOf?.();

  // This should trigger @typescript-eslint/no-explicit-any error (using 'any' type)
  const anyValue: any = 'test';
  
  // This should trigger error for type assertion to 'any'
  const castToAny = 'some value' as any;

  // This should trigger no-trailing-spaces warning
  return <div>{greeting} Age: {displayAge} Result: {result} Nested: {nested} Any: {anyValue} Cast: {castToAny}</div>;
}

export default InvalidComponent;