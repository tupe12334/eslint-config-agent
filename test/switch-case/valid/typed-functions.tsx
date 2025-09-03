// Valid switch cases with properly typed functions
export function validTypedFunctions(action: "process" | "transform" | "validate" | "compute"): string {
  switch (action) {
    case "process": {
      const processor = (data: string): string => {
        return `processed: ${data}`;
      };
      return processor("test data");
    }

    case "transform": {
      const transformer = function(input: string): string {
        return input.toUpperCase();
      };
      return transformer("hello world");
    }

    case "validate": {
      const validator = (value: string): boolean => {
        return value.length > 0;
      };
      const isValid = validator("test");
      return isValid ? "valid" : "invalid";
    }

    case "compute": {
      const computer = function(): number {
        return Math.random() * 100;
      };
      return computer().toString();
    }
  }
}

export function validNestedFunctions(type: "async" | "callback"): string {
  switch (type) {
    case "async": {
      const asyncProcessor = async (data: string): Promise<string> => {
        return Promise.resolve(`async: ${data}`);
      };
      return "async operation started";
    }

    case "callback": {
      const callbackHandler = (callback: () => string): string => {
        return callback();
      };
      const resultCallback = (): string => "callback result";
      return callbackHandler(resultCallback);
    }
  }
}