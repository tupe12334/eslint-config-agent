# Switch Statements Return Type Rule

This rule enforces explicit return type annotations for functions that contain switch statements.

## Purpose

Functions containing switch statements should have explicit return type annotations to:
- Ensure type safety across all switch cases
- Make return type contracts clear and explicit
- Prevent accidental type inconsistencies between cases

## Rule Details

This rule restricts the following patterns:

❌ **Incorrect:**
```typescript
function handleAction(action) {
  switch (action.type) {
    case 'increment':
      return { count: action.payload + 1 };
    case 'decrement':
      return { count: action.payload - 1 };
  }
}

const processValue = (value) => {
  switch (typeof value) {
    case 'string':
      return value.toUpperCase();
    case 'number':
      return value.toString();
  }
};
```

✅ **Correct:**
```typescript
function handleAction(action): { count: number } {
  switch (action.type) {
    case 'increment':
      return { count: action.payload + 1 };
    case 'decrement':
      return { count: action.payload - 1 };
  }
}

const processValue = (value): string => {
  switch (typeof value) {
    case 'string':
      return value.toUpperCase();
    case 'number':
      return value.toString();
  }
};
```

## Configuration

This rule is implemented using `no-restricted-syntax` with the following selectors:

- `FunctionDeclaration:has(SwitchStatement):not([returnType])`
- `ArrowFunctionExpression:has(SwitchStatement):not([returnType])`
- `FunctionExpression:has(SwitchStatement):not([returnType])`