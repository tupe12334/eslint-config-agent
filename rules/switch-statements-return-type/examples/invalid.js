// Examples of code that violate the switch statements return type rule

// Function declaration without return type
function handleAction(action) {
  switch (action.type) {
    case 'increment':
      return { count: action.payload + 1 };
    case 'decrement':
      return { count: action.payload - 1 };
  }
}

// Arrow function without return type
const processValue = (value) => {
  switch (typeof value) {
    case 'string':
      return value.toUpperCase();
    case 'number':
      return value.toString();
  }
};

// Function expression without return type
const calculator = function(operation, a, b) {
  switch (operation) {
    case 'add':
      return a + b;
    case 'subtract':
      return a - b;
    case 'multiply':
      return a * b;
  }
};

// Nested function with switch statement
function outerFunction() {
  function innerFunction(type) {
    switch (type) {
      case 'a':
        return 'Alpha';
      case 'b':
        return 'Beta';
    }
  }
  return innerFunction;
}