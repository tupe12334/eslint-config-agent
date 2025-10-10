// Valid: Arrow functions using named union types

type EventType = 'click' | 'hover' | 'focus';

// ✅ Arrow function with named type
export const handleEvent = (type: EventType) => {
  console.log(type);
};
