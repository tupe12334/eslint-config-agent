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

The package includes comprehensive testing to validate the configuration:

```bash
# Run all tests
pnpm test

# Run validation script
pnpm validate

# Lint the project
pnpm lint

# CI-ready linting (zero warnings allowed)
pnpm test:ci
```

### Test Files

- `test/valid.tsx` - Valid TypeScript React code
- `test/invalid.tsx` - Code that should trigger errors and warnings
- `test/preact-test.tsx` - Preact component testing
- `test/long-function.tsx` - Function length limit testing
- `test/jsx-extension-test.js` - JSX in JS file testing (should error)

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