// Invalid switch cases with default cases (not allowed)

// Invalid: switch with default case at end
export function invalidWithDefaultEnd(value: "case1" | "case2"): string {
  switch (value) {
    case "case1":
      return "result1";
    case "case2":
      return "result2";
    default:
      return "default";
  }
}

// Invalid: switch with default case at beginning
export function invalidWithDefaultFirst(value: "case1" | "case2"): string {
  switch (value) {
    default:
      return "default";
    case "case1":
      return "result1";
    case "case2":
      return "result2";
  }
}

// Invalid: switch with default case in middle
export function invalidWithDefaultMiddle(value: "case1" | "case2" | "case3"): string {
  switch (value) {
    case "case1":
      return "result1";
    default:
      return "default";
    case "case2":
      return "result2";
    case "case3":
      return "result3";
  }
}

// Invalid: single default case (but still not allowed)
export function invalidWithSingleDefault(value: "case1"): string {
  switch (value) {
    case "case1":
      return "result1";
    default:
      return "default1";
  }
}