// Invalid: Arrow function parameters with inline union types

// ❌ Arrow function with inline union
export const handleEvent = (type: 'click' | 'hover' | 'focus') => {
  console.log(type);
};
