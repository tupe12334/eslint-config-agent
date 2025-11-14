# no-record-literal-types

Disallows using Record type with string literal keys in favor of more specific interface or type definitions.

## Rule Details

This rule helps enforce better type safety and readability by discouraging the use of `Record<LiteralKeys, ValueType>` patterns and encouraging more explicit type definitions.

## Examples

❌ **Incorrect** - Record with literal keys:

```typescript
type UserInfo = Record<'name' | 'age', string>
type Status = Record<'active', boolean>
type Config = Record<'host' | 'port' | 'ssl', string>
```

✅ **Correct** - Explicit interfaces and types:

```typescript
interface UserInfo {
  name: string
  age: string
}

type Status = {
  active: boolean
}

type Config = {
  host: string
  port: number
  ssl: boolean
}
```

✅ **Correct** - Generic Record types:

```typescript
type UserData = Record<string, unknown>
type IndexMap = Record<number, string>
type DynamicKeys = Record<`prefix-${string}`, boolean>
```

## Why This Rule Exists

1. **Better IntelliSense**: Explicit interfaces provide better autocomplete and documentation
2. **Type Safety**: More specific types catch errors earlier
3. **Maintainability**: Clear structure makes code easier to understand and modify
4. **Consistency**: Encourages consistent type definition patterns

## Testing

This rule is tested through integration tests in `/test/test-record-literals.ts` which validates that the rule correctly identifies and reports violations in real TypeScript code.

The rule uses two AST selectors to comprehensively catch Record literal patterns:

1. `.params:first-child TSLiteralType` - Catches literals inside unions
2. `TSLiteralType:first-child` - Catches direct literal types

## Configuration

This rule is automatically included when using the eslint-config-agent package and applies to all TypeScript files.
