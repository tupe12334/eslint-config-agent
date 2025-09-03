// Valid switch cases with explicit return values
export function validExplicitReturns(value: "case1" | "case2" | "case3"): string {
  switch (value) {
    case "case1":
      return "explicit value 1";

    case "case2": {
      return "explicit value 2";
    }

    case "case3": {
      const result = "computed value";
      return result;
    }
  }
}

type ReturnType = number | string;

export function validComplexReturns(value: 1 | 2 | 3): ReturnType {
  switch (value) {
    case 1:
      return 42;

    case 2: {
      const computed = value * 10;
      return computed;
    }

    case 3: {
      if (value > 2) {
        return "greater than 2";
      }
      return value;
    }
  }
}