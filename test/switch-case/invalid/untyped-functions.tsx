// Invalid switch cases with untyped functions
export function invalidUntypedFunctions(action: "process" | "transform" | "validate" | "compute"): string {
  switch (action) {
    case "process": {
      // Invalid: arrow function without return type
      const processor = (data: string) => {
        return `processed: ${data}`;
      };
      return processor("test data");
    }

    case "transform": {
      // Invalid: function expression without return type
      const transformer = function(input: string) {
        return input.toUpperCase();
      };
      return transformer("hello world");
    }

    case "validate": {
      // Invalid: arrow function without return type
      const validator = (value: string) => {
        return value.length > 0;
      };
      const isValid = validator("test");
      return isValid ? "valid" : "invalid";
    }

    case "compute": {
      // Invalid: function expression without return type
      const computer = function() {
        return Math.random() * 100;
      };
      return computer().toString();
    }
  }
}

export function invalidComplexUntypedFunctions(type: "nested" | "async"): string {
  switch (type) {
    case "nested": {
      // Invalid: arrow function without return type
      const outer = (callback) => {
        return callback();
      };
      // Invalid: arrow function without return type
      const inner = () => {
        return "nested result";
      };
      return outer(inner);
    }

    case "async": {
      // Invalid: async arrow function without return type
      const asyncProcessor = async (data: string) => {
        return Promise.resolve(`async: ${data}`);
      };
      return "async operation started";
    }
  }
}