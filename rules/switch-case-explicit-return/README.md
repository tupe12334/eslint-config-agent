# Switch Case Explicit Return Rule

This rule enforces that return statements in switch cases must provide an explicit return value. Empty return statements (`return;`) are not allowed in switch cases.

## Purpose

Return statements in switch cases should have explicit values to:

- Ensure consistent return behavior across all switch cases
- Make the intent of each case branch clear and explicit
- Prevent accidental undefined returns that could cause runtime issues
- Maintain predictable function behavior

## Rule Details

This rule restricts the following patterns:

❌ **Incorrect:**

```typescript
function processAction(action: string) {
  switch (action) {
    case 'skip':
      return // Empty return - not allowed
    case 'process': {
      if (someCondition) {
        return // Empty return in block - not allowed
      }
      return 'processed'
    }
  }
}

function handleStatus(status: string) {
  switch (status) {
    case 'pending':
      return // Empty return - not allowed
    case 'complete':
      return 'done'
  }
}
```

✅ **Correct:**

```typescript
function processAction(action: string): string | undefined {
  switch (action) {
    case 'skip':
      return undefined // Explicit undefined return
    case 'process': {
      if (someCondition) {
        return 'skipped' // Explicit return value
      }
      return 'processed'
    }
  }
}

function handleStatus(status: string): string {
  switch (status) {
    case 'pending':
      return 'waiting' // Explicit return value
    case 'complete':
      return 'done'
  }
}

// Alternative: Use break instead of return for control flow
function processWithBreak(action: string): string {
  let result = 'default'

  switch (action) {
    case 'skip':
      result = 'skipped'
      break // Use break instead of empty return
    case 'process':
      result = 'processed'
      break
  }

  return result
}
```

## Configuration

This rule is implemented using `no-restricted-syntax` with the following selectors:

- `SwitchStatement > SwitchCase > ReturnStatement[argument=null]`
- `SwitchStatement > SwitchCase > BlockStatement > ReturnStatement[argument=null]`

## Related Rules

- [switch-case-functions-return-type](../switch-case-functions-return-type/README.md) - Enforces return type annotations for functions in switch cases
- [switch-statements-return-type](../switch-statements-return-type/README.md) - Enforces return types for functions containing switch statements

## Common Patterns

### Explicit Undefined Returns

```typescript
function maybeProcess(condition: boolean): string | undefined {
  switch (condition) {
    case true:
      return 'processed'
    case false:
      return undefined // Explicit undefined instead of empty return
  }
}
```

### Explicit Null Returns

```typescript
function findItem(id: string): Item | null {
  switch (id) {
    case 'unknown':
      return null // Explicit null instead of empty return
    default:
      return getItem(id)
  }
}
```

### Using Break for Control Flow

```typescript
function processWithSideEffects(action: string): void {
  switch (action) {
    case 'log':
      console.log('Action logged')
      break // Better than empty return for void functions
    case 'save':
      saveData()
      break
  }
}
```
