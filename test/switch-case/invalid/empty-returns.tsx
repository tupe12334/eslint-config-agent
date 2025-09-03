// Invalid switch cases with empty return statements
type MaybeString = string | undefined;

export function invalidEmptyReturns(value: "case1" | "case2" | "case3" | "case4"): MaybeString {
  switch (value) {
    case "case1":
      // Invalid: empty return statement
      return;

    case "case2": {
      // Invalid: empty return statement in block
      return;
    }

    case "case3": {
      const shouldReturn = true;
      if (shouldReturn) {
        // Invalid: empty return statement
        return;
      }
      return "fallback";
    }

    case "case4":
      // Valid: explicit return value
      return "valid case";
  }
}

type StringOrVoid = string | void;

export function invalidMixedReturns(action: "empty1" | "empty2" | "valid" | "empty3"): StringOrVoid {
  switch (action) {
    case "empty1":
      // Invalid: empty return
      return;

    case "empty2": {
      // Invalid: empty return in block
      return;
    }

    case "valid":
      return "this is valid";

    case "empty3":
      // Invalid: empty return
      return;
  }
}