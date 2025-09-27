// Examples of code that follow the switch statements return type rule

// Function declaration with return type
function handleAction(action): { count: number } {
  switch (action.type) {
    case 'increment':
      return { count: action.payload + 1 };
    case 'decrement':
      return { count: action.payload - 1 };
  }
}

// Arrow function with return type
const processValue = (value): string => {
  switch (typeof value) {
    case 'string':
      return value.toUpperCase();
    case 'number':
      return value.toString();
  }
};

// Function expression with return type
const calculator = function(operation, a, b): number {
  switch (operation) {
    case 'add':
      return a + b;
    case 'subtract':
      return a - b;
    case 'multiply':
      return a * b;
  }
};

// Nested function with return type
function outerFunction(): (type: string) => string {
  function innerFunction(type): string {
    switch (type) {
      case 'a':
        return 'Alpha';
      case 'b':
        return 'Beta';
    }
  }
  return innerFunction;
}

// Functions without switch statements don't need return types (rule doesn't apply)
function simpleFunction(x) {
  return x + 1;
}

const simpleArrow = (x) => x * 2;