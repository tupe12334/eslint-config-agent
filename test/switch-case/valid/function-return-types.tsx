// Valid functions containing switch statements with explicit return types

// Valid: function declaration with return type
export function validFunction(value: "test" | "other"): string {
  switch (value) {
    case "test":
      return "result";
    case "other":
      return "other result";
  }
}

// Valid: arrow function with return type
export const validArrowFunction = (value: "test" | "other"): string => {
  switch (value) {
    case "test":
      return "result";
    case "other":
      return "other result";
  }
};

// Valid: function expression with return type
export const validFunctionExpression = function(value: "test" | "other"): string {
  switch (value) {
    case "test":
      return "result";
    case "other":
      return "other result";
  }
};

// Valid: complex return type
interface ActionResult { success: boolean; message: string }

export function validComplexFunction(action: "save" | "delete"): ActionResult {
  switch (action) {
    case "save":
      return { success: true, message: "Saved successfully" };
    case "delete":
      return { success: true, message: "Deleted successfully" };
  }
}

// Valid: function without switch statement (should not be affected by rule)
export function functionWithoutSwitch(value: string) {
  return value.toUpperCase();
}

// Valid: async function with switch
export async function validAsyncFunction(type: "fetch" | "load"): Promise<string> {
  switch (type) {
    case "fetch":
      return Promise.resolve("fetched data");
    case "load":
      return Promise.resolve("loaded data");
  }
}