// Examples of code that follow the switch case functions return type rule

// Arrow functions in switch cases with return types
function handleAction(action) {
  switch (action.type) {
    case 'increment':
      const incrementer = (value): number => value + 1;
      return incrementer(action.payload);
    case 'decrement':
      const decrementer = (value): number => value - 1;
      return decrementer(action.payload);
  }
}

// Function expressions in switch cases with return types
function processValue(type, value) {
  switch (type) {
    case 'string':
      const formatter = function(val): string {
        return val.toUpperCase();
      };
      return formatter(value);
    case 'number':
      const calculator = function(val): number {
        return val * 2;
      };
      return calculator(value);
  }
}

// Functions in block statements within switch cases
function advancedProcessor(operation, data) {
  switch (operation) {
    case 'transform': {
      const transformer = (input): number[] => {
        return input.map(x => x * 2);
      };
      return transformer(data);
    }
    case 'filter': {
      const filterer = function(input): number[] {
        return input.filter(x => x > 0);
      };
      return filterer(data);
    }
  }
}

// Complex return types
function dataProcessor(operation, items) {
  switch (operation) {
    case 'map':
      const mapper = (transform): (item: any) => any => {
        return item => transform(item);
      };
      return mapper;
    case 'reduce':
      const reducer = function(accumulator, current): { total: number } {
        return { total: accumulator.total + current };
      };
      return reducer;
  }
}

// Switch cases without functions (rule doesn't apply)
function simpleSwitch(type) {
  switch (type) {
    case 'a':
      return 'Alpha';
    case 'b':
      return 'Beta';
  }
}

// Functions outside switch cases (rule doesn't apply)
function outsideFunction(value) {
  const helper = (x) => x + 1; // Rule doesn't apply here

  switch (value) {
    case 1:
      return helper(value);
  }
}