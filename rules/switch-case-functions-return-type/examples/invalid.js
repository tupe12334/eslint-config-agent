// Examples of code that violate the switch case functions return type rule

// Arrow functions in switch cases without return types
function handleAction(action) {
  switch (action.type) {
    case 'increment':
      const incrementer = (value) => value + 1; // Missing return type
      return incrementer(action.payload);
    case 'decrement':
      const decrementer = (value) => value - 1; // Missing return type
      return decrementer(action.payload);
  }
}

// Function expressions in switch cases without return types
function processValue(type, value) {
  switch (type) {
    case 'string':
      const formatter = function(val) { // Missing return type
        return val.toUpperCase();
      };
      return formatter(value);
    case 'number':
      const calculator = function(val) { // Missing return type
        return val * 2;
      };
      return calculator(value);
  }
}

// Functions in block statements within switch cases
function advancedProcessor(operation, data) {
  switch (operation) {
    case 'transform': {
      const transformer = (input) => { // Missing return type
        return input.map(x => x * 2);
      };
      return transformer(data);
    }
    case 'filter': {
      const filterer = function(input) { // Missing return type
        return input.filter(x => x > 0);
      };
      return filterer(data);
    }
  }
}

// Nested switch cases with functions
function complexHandler(outerType, innerType, value) {
  switch (outerType) {
    case 'level1':
      switch (innerType) {
        case 'level2':
          const nestedHandler = (val) => val.toString(); // Missing return type
          return nestedHandler(value);
      }
  }
}