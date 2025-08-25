# @tupe12334/eslint-config

A comprehensive ESLint configuration package that provides TypeScript, React, and Preact linting rules with strict coding standards.

## Features

- **TypeScript Support**: Full TypeScript ESLint integration
- **React & Preact**: Complete support for both React and Preact projects
- **Strict Standards**: Enforces explicit null/undefined checks, disallows optional chaining and nullish coalescing
- **Code Quality**: Function length limits, trailing space detection, and more
- **Modern ESLint**: Uses the new flat configuration format

## Installation

```bash
npm install --save-dev @tupe12334/eslint-config
# or
pnpm add -D @tupe12334/eslint-config
# or
yarn add -D @tupe12334/eslint-config
```

## Usage

Create an `eslint.config.js` file in your project root:

```javascript
import config from '@tupe12334/eslint-config';

export default config;
```

Or extend it with your own rules:

```javascript
import baseConfig from '@tupe12334/eslint-config';

export default [
  ...baseConfig,
  {
    rules: {
      // Your custom rules here
    },
  },
];
```

## Rules Overview

### Key Restrictions
- **No Optional Chaining** (`?.`): Use explicit null/undefined checks instead
- **No Nullish Coalescing** (`??`): Use explicit null/undefined checks instead
- **JSX File Extensions**: JSX is only allowed in `.tsx` and `.jsx` files
- **Function Length**: Functions are limited to 100 lines (warnings)
- **Trailing Spaces**: Not allowed (warnings)

### Disabled Rules
This configuration disables many common ESLint and React rules to provide a more flexible development experience while maintaining code quality through specific restrictions.

## Development

### Testing

The package includes comprehensive testing to validate the configuration works correctly across various scenarios:

```bash
# Run comprehensive test suite
pnpm test

# Run specific test categories
pnpm test:valid          # Valid code samples
pnpm test:invalid        # Invalid code samples  
pnpm test:hooks          # React hooks rules
pnpm test:imports        # Import/export patterns
pnpm test:edge           # Edge cases
pnpm test:performance    # Large files and complex code

# Legacy validation script
pnpm validate

# Lint the entire project
pnpm lint

# CI-ready linting (zero warnings allowed)
pnpm test:ci
```

### Test Coverage

The test suite covers 8+ categories with detailed validation:

**Core Rules Testing:**
- `test/valid.tsx` - Valid TypeScript React code
- `test/invalid.tsx` - Code that should trigger specific errors
- `test/jsx-extension-test.js` - JSX in JS file testing (should error)
- `test/long-function.tsx` - Function length limit testing

**Framework-Specific Testing:**
- `test/preact-test.tsx` - Preact component validation
- `test/react-hooks-rules.tsx` - React hooks rules validation
- `test/typescript-rules.ts` - TypeScript-specific features

**Advanced Testing:**
- `test/import-export-rules.ts` - Import/export patterns
- `test/edge-cases.tsx` - Edge cases and boundary conditions
- `test/performance-test.tsx` - Large files and complex scenarios

**Automated Validation:**
- `scripts/test-runner.js` - Comprehensive test runner with categorized validation
- `scripts/validate-config.js` - Legacy configuration validator

## Supported File Types

- **TypeScript**: `.ts`, `.tsx`
- **JavaScript**: `.js`, `.jsx`
- **Frameworks**: React, Preact
- **Module Systems**: ES Modules

## Dependencies

- ESLint 9.x
- TypeScript ESLint
- React ESLint plugins
- Preact ESLint plugin

## License

ISC