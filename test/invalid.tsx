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
  
  // This should trigger no-trailing-spaces warning
  return <div>{greeting} Age: {displayAge} Result: {result} Nested: {nested}</div>;   
}

export default InvalidComponent;