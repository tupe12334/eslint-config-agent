# Switch Case Functions Return Type Rule

This rule enforces explicit return type annotations for arrow functions and function expressions defined within switch cases.

## Purpose

Functions defined inside switch cases should have explicit return type annotations to:

- Ensure type consistency across different case branches
- Make function contracts clear and explicit within switch logic
- Prevent accidental type inconsistencies in case-specific function implementations

## Rule Details

This rule restricts the following patterns:

❌ **Incorrect:**

```typescript
function processAction(action) {
  switch (action.type) {
    case 'increment':
      const handler = value => value + 1 // Missing return type
      return handler(action.payload)
    case 'decrement':
      const processor = function (value) {
        // Missing return type
        return value - 1
      }
      return processor(action.payload)
    case 'multiply': {
      const multiplier = value => value * 2 // Missing return type
      return multiplier(action.payload)
    }
  }
}
```

✅ **Correct:**

```typescript
function processAction(action) {
  switch (action.type) {
    case 'increment':
      const handler = (value): number => value + 1
      return handler(action.payload)
    case 'decrement':
      const processor = function (value): number {
        return value - 1
      }
      return processor(action.payload)
    case 'multiply': {
      const multiplier = (value): number => value * 2
      return multiplier(action.payload)
    }
  }
}
```

## Configuration

This rule is implemented using `no-restricted-syntax` with the following selectors:

- `SwitchStatement > SwitchCase ArrowFunctionExpression:not([returnType])`
- `SwitchStatement > SwitchCase FunctionExpression:not([returnType])`
- `SwitchStatement > SwitchCase > BlockStatement ArrowFunctionExpression:not([returnType])`
- `SwitchStatement > SwitchCase > BlockStatement FunctionExpression:not([returnType])`

## Related Rules

- [switch-statements-return-type](../switch-statements-return-type/README.md) - Enforces return types for functions containing switch statements
