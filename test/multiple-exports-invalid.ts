// This file should trigger import/group-exports warnings
// Multiple export declarations should be flagged

export const firstFunction = () => {
  return 'first';
};

export const secondFunction = () => {
  return 'second';
};

export interface MyInterface {
  id: string;
}

export type MyType = {
  name: string;
};

export class MyClass {
  constructor() {}
}

// These should also be flagged
export { firstFunction as first };
export { secondFunction as second };

// Re-exports are now allowed (single named re-exports only)
export { useState } from 'react';
export type { ReactNode } from 'react';

// Default export that should be flagged
export default function DefaultFunction() {
  return 'default';
}