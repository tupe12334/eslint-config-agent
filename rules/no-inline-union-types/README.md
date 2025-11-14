# no-inline-union-types

Disallows inline union types in type annotations, requiring named type declarations instead for better type reusability and maintainability.

## Rule Details

This rule helps enforce better code organization and type reusability by discouraging inline union type literals and encouraging named type declarations. This makes types easier to reuse, refactor, and maintain across your codebase.

## Examples

❌ **Incorrect** - Inline union types:

```typescript
// Function parameters
function processRequest(method: 'GET' | 'POST' | 'PUT') {}

// Interface properties
interface User {
  role: 'admin' | 'user' | 'guest'
}

// Class properties
class Config {
  mode: 'dev' | 'prod'
}
```

✅ **Correct** - Named type declarations:

```typescript
// Named type for reusability
type HttpMethod = 'GET' | 'POST' | 'PUT'
function processRequest(method: HttpMethod) {}

// Named type in interfaces
type UserRole = 'admin' | 'user' | 'guest'
interface User {
  role: UserRole
}

// Named type in classes
type Environment = 'dev' | 'prod'
class Config {
  mode: Environment
}
```

✅ **Correct** - Top-level union type declarations:

```typescript
// These are fine - they're named types
type Status = 'pending' | 'success' | 'error'
type Theme = 'light' | 'dark' | 'auto'
type Size = 'small' | 'medium' | 'large'
```

## Why This Rule Exists

1. **Reusability**: Named types can be used across multiple interfaces, functions, and classes
2. **Maintainability**: Changing a union type in one place updates all usages
3. **Documentation**: Named types serve as self-documenting code
4. **Type Safety**: Ensures consistent type usage across the codebase
5. **DRY Principle**: Avoids repeating the same union definitions

## Real-World Example

Instead of:

```typescript
async function listCourses(params?: {
  audience?: 'open' | 'professional'
  offered_by?: 'Bootcamps' | 'CSAIL' | 'MITx' | 'OCW'
  offset?: number
  limit?: number
}) {}
```

Use:

```typescript
type Audience = 'open' | 'professional'
type OfferedBy = 'Bootcamps' | 'CSAIL' | 'MITx' | 'OCW'

type ListCoursesParams = {
  audience?: Audience
  offered_by?: OfferedBy
  offset?: number
  limit?: number
}

async function listCourses(params?: ListCoursesParams) {}
```

## Testing

This rule is tested through:

- Unit tests in `no-inline-union-types.spec.js`
- Integration tests in `/test/union-types/` directory
- Examples in the `examples/` directory

The rule uses three AST selectors to comprehensively catch inline union patterns:

1. General inline union types (excluding property-specific cases)
2. Interface properties with literal unions
3. Class properties with literal unions

## Configuration

This rule is automatically included when using the eslint-config-agent package and applies to all TypeScript files.
