// Invalid functions containing switch statements without explicit return types

// Invalid: function declaration without return type
export function invalidFunction(value: "test" | "other") {
  switch (value) {
    case "test":
      return "result";
    case "other":
      return "other result";
  }
}

// Invalid: arrow function without return type
export const invalidArrowFunction = (value: "test" | "other") => {
  switch (value) {
    case "test":
      return "result";
    case "other":
      return "other result";
  }
};

// Invalid: function expression without return type
export const invalidFunctionExpression = function(value: "test" | "other") {
  switch (value) {
    case "test":
      return "result";
    case "other":
      return "other result";
  }
};

// Invalid: complex function without return type
export function invalidComplexFunction(action: "save" | "delete") {
  switch (action) {
    case "save":
      return { success: true, message: "Saved successfully" };
    case "delete":
      return { success: true, message: "Deleted successfully" };
  }
}

// Invalid: async function without return type
export async function invalidAsyncFunction(type: "fetch" | "load") {
  switch (type) {
    case "fetch":
      return Promise.resolve("fetched data");
    case "load":
      return Promise.resolve("loaded data");
  }
}

// Valid: function without switch statement (should not trigger rule)
export function functionWithoutSwitch(value: string) {
  return value.toUpperCase();
}

// Invalid: nested function with switch but no return type
export function parentFunction(): string {
  const nestedFunction = function(value: "nested" | "other") {
    switch (value) {
      case "nested":
        return "nested result";
      case "other":
        return "other nested";
    }
  };
  return nestedFunction("test");
}