# eslint-config-agent

[![npm version](https://badge.fury.io/js/eslint-config-agent.svg)](https://badge.fury.io/js/eslint-config-agent)
[![npm downloads](https://img.shields.io/npm/dm/eslint-config-agent.svg)](https://www.npmjs.com/package/eslint-config-agent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stand With Israel](https://img.shields.io/badge/Stand%20With-Israel-0072ce)](https://www.standwithus.com/)

A comprehensive ESLint configuration package that provides TypeScript, React, and Preact linting rules with strict coding standards designed for enterprise-grade applications and AI-assisted development.

## Why eslint-config-agent?

**Designed for the AI Development Era** 🤖

In an age where AI coding assistants and code generators are increasingly common, maintaining readable and maintainable code becomes critical. This ESLint configuration is specifically designed to prevent AI agents from generating unmaintainable or unreadable code that can leave developers lost in their own codebase.

### Key Benefits

- **🤖 AI-Friendly Rules**: Prevents AI assistants from writing shortcuts that hurt long-term maintainability
- **🔍 Explicit Over Clever**: Forces clear, readable patterns instead of "clever" but obscure code
- **🚀 Production-Ready**: Battle-tested configuration used in production environments
- **🔒 Type Safety First**: Enforces explicit null/undefined checks instead of optional chaining
- **⚡ Modern ESLint**: Built for ESLint 9+ with flat configuration format
- **🎯 Framework Agnostic**: Works seamlessly with React, Preact, and pure TypeScript
- **📦 Zero Config**: Works out of the box with sensible defaults
- **🔧 Extensible**: Easy to customize and extend for your specific needs

### The Problem with AI-Generated Code

AI coding assistants often generate code that:

- Uses convenient shortcuts like `?.` and `??` that hide potential runtime issues
- Creates complex nested structures that are hard to debug
- Prioritizes brevity over clarity
- Makes assumptions about data structures that may not hold over time

### Our Solution

This configuration enforces patterns that:

- Make null/undefined handling explicit and clear
- Keep functions at manageable lengths (≤100 lines)
- Require proper file organization and naming
- Ensure consistent, readable code structure

## Key Features

- **🛠️ TypeScript First**: Full TypeScript ESLint integration with advanced type checking
- **⚛️ React & Preact**: Complete support for both React and Preact projects
- **🔐 Strict Standards**: Enforces explicit null/undefined checks, requires strict equality (`===`/`!==`), and disallows optional chaining and nullish coalescing for better code clarity
- **📏 Code Quality**: Function length limits (100 lines), trailing space detection, and consistent formatting
- **🧪 DDD by Default**: Requires spec files for all source files to ensure comprehensive test coverage
- **🚀 Modern ESLint**: Uses the latest flat configuration format (ESLint 9+)
- **📋 Comprehensive Testing**: 12+ test categories with automated validation
- **🔄 CI/CD Ready**: Zero-warning configuration for production builds

## Installation

### Prerequisites

- **Node.js**: 20.x or higher
- **ESLint**: 9.x
- **TypeScript**: 4.5+ (optional, for TypeScript projects)

### Install the package

```bash
# Using npm
npm install --save-dev eslint-config-agent

# Using pnpm (recommended)
pnpm add -D eslint-config-agent

# Using yarn
yarn add -D eslint-config-agent
```

### Dependencies are bundled

There is **no separate peer-dependency step**. ESLint and every plugin this
configuration uses (`@typescript-eslint/*`, `typescript-eslint`,
`eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-import`,
`eslint-plugin-preact`, `globals`, and the rest) ship as regular dependencies
of `eslint-config-agent`. Installing the package pulls them in automatically,
so the config works out of the box.

```bash
# That's it — the single install above is all you need
npm install --save-dev eslint-config-agent
```

> **Note:** If your project already depends on ESLint or any of these plugins,
> your package manager will deduplicate them against the versions bundled here.

## Usage

### Quick Start

Create an `eslint.config.js` file in your project root:

```javascript
import config from 'eslint-config-agent'

export default config
```

### Advanced Configuration

#### Extending with Custom Rules

```javascript
import baseConfig from 'eslint-config-agent'

export default [
  ...baseConfig,
  {
    rules: {
      // Override or add your custom rules
      'no-console': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
]
```

#### Project-Specific Ignores

```javascript
import baseConfig from 'eslint-config-agent'

export default [
  ...baseConfig,
  {
    ignores: ['build/**', 'dist/**', 'coverage/**', '*.config.js'],
  },
]
```

#### File-Specific Overrides

```javascript
import baseConfig from 'eslint-config-agent'

export default [
  ...baseConfig,
  {
    files: ['**/*.test.{ts,tsx,js,jsx}'],
    rules: {
      // Relax rules for test files
      'max-lines-per-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
  },
]
```

### Integration with Popular Tools

#### VS Code Setup

Add to your `.vscode/settings.json`:

```json
{
  "eslint.enable": true,
  "eslint.format.enable": true,
  "eslint.useFlatConfig": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

#### Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:ci": "eslint . --max-warnings 0"
  }
}
```

## Rules & Configuration

### Core Philosophy

This ESLint configuration prioritizes **explicit code** over convenient shortcuts, especially important when working with AI coding assistants. Instead of allowing potentially unsafe operations like optional chaining, it enforces explicit null/undefined checks that make your intentions clear and your code more maintainable.

**Why This Matters for AI Development:**

- **🧠 Human-Readable**: Code that humans can easily understand and modify
- **🔍 Debuggable**: Clear error paths and explicit state handling
- **📚 Self-Documenting**: Code that explains its intent without extensive comments
- **🛠️ Maintainable**: Patterns that remain clear even as the codebase grows

### Control Flow & Readability

- **`no-else-return`** (`allowElseIf: false`): Forbids an `else`/`else if` block
  when the preceding `if` already exits via `return`. Once the `if` branch
  returns, the `else` only adds nesting that hides the real control flow.
  Removing it flattens the code into guard-clause style — the same goal as the
  bundled `early-return` plugin. Auto-fixable with `eslint --fix`.
- **`no-nested-ternary`**: Forbids a ternary inside another ternary, the
  archetypal "clever but unreadable" construct. Use `if`/`else` or an early
  return instead.

### Import Hygiene

- **`import/no-duplicates`**: Collapses multiple import statements from the same
  module into one, so dependencies on a module are visible in a single place.
- **`import/no-mutable-exports`**: Forbids exporting mutable bindings
  (`export let` / `export var`). Mutable exports create shared mutable state
  across modules — a subtle, hard-to-trace footgun that AI assistants often
  reach for. Export `const` (or a getter) instead.
- **`import/no-cycle`**: Forbids circular dependencies between modules. Cycles
  cause order-dependent runtime bugs (a module observing a half-initialized
  import as `undefined`) and signal tangled module boundaries. The TypeScript
  parser is wired into `import/parsers` so this analysis also works across
  `.ts`/`.tsx` files, not just plain JavaScript.
- **`import/no-self-import`**: Forbids a module importing itself, a degenerate
  cycle that is always a mistake.

### Framework-Specific Features

#### React Support

- React 17+ automatic JSX runtime support
- Comprehensive hooks validation (rules-of-hooks, exhaustive-deps)
- Component prop validation
- JSX accessibility hints

#### Preact Support (Optional)

- Automatic detection and configuration when `eslint-plugin-preact` is installed
- Compatible with Preact-specific patterns and optimizations
- Shared configuration with React rules where applicable

### Spec File Requirements (DDD)

**By default, this configuration requires that every source file has a corresponding spec file.** This ensures comprehensive test coverage and encourages test-driven development.

**What files require specs:**

- All TypeScript/JavaScript source files (`.ts`, `.js`, `.tsx`, `.jsx`)
- Implementation files that contain business logic

**What files are excluded:**

- Test files themselves (`.spec.ts`, `.test.js`, etc.)
- Configuration files (`.config.js`, `eslint.config.js`, etc.)
- Index/barrel files (`index.ts`, `index.js`)
- Type definition files (`.d.ts`)
- Storybook files (`.stories.tsx`)
- Example files in `examples/` directories
- Error files (`.error.ts`, `-error.ts`, `errors/`, `exceptions/`)

**Example structure:**

```
src/
├── utils.ts          # Requires: utils.spec.ts
├── utils.spec.ts     # ✅ Spec file present
├── components/
│   ├── Button.tsx    # Requires: Button.spec.tsx
│   ├── Button.spec.tsx  # ✅ Spec file present
│   └── index.ts      # ⚠️ Excluded (index file)
└── config.ts         # ⚠️ Excluded (config file)
```

**Disabling for specific files:**

If you have files that only export simple Error classes or other boilerplate without testable logic, you can:

1. **Use a naming convention** (automatically excluded):
   - `my-error.ts`, `configuration-error.ts`
   - `my.error.ts`, `configuration.error.ts`
   - Place in `errors/` or `exceptions/` directory

2. **Add an inline comment** for non-conventional names:

   ```typescript
   /* eslint-disable ddd/require-spec-file */
   export class ConfigurationError extends Error {
     constructor(message: string) {
       super(message)
       this.name = 'ConfigurationError'
     }
   }
   ```

3. **Disable for entire directories** in your `eslint.config.js`:

   ```javascript
   import baseConfig from 'eslint-config-agent'

   export default [
     ...baseConfig,
     {
       files: ['src/legacy/**/*.ts'],
       rules: {
         'ddd/require-spec-file': 'off',
       },
     },
   ]
   ```

### Honest Suppressions

The config sets `linterOptions.reportUnusedDisableDirectives` to `error`. An `eslint-disable` comment that no longer suppresses anything is reported as an error instead of being silently ignored.

This keeps every suppression honest: once a rule is satisfied (or renamed), the stale directive surfaces immediately so it can be removed, rather than quietly widening the set of unchecked code over time. It pairs naturally with the config's explicit-over-clever philosophy.

```typescript
// eslint-disable-next-line ddd/require-spec-file -- once the spec exists this
// directive is unused, and ESLint now flags it so you delete it.
export const value = 1
```

### Configuration Philosophy

This configuration focuses on enforcing patterns that improve long-term maintainability while reducing noise from less impactful rules. The ruleset is carefully curated to balance developer productivity with code quality.

For migration instructions from legacy ESLint configurations, see [MIGRATION.md](MIGRATION.md).

For troubleshooting common issues and frequently asked questions, see [FAQ.md](FAQ.md).

For development setup, testing guidelines, and contribution instructions, see [CONTRIBUTING.md](CONTRIBUTING.md).

For version history and changelog information, see [CHANGELOG.md](CHANGELOG.md) or the [releases page](https://github.com/tupe12334/eslint-config/releases).

## License

**MIT License** - See [LICENSE](LICENSE) file for details.

## Links & Resources

- **📦 [npm Package](https://www.npmjs.com/package/eslint-config-agent)**
- **🐙 [GitHub Repository](https://github.com/tupe12334/eslint-config)**
- **📋 [Issues & Bug Reports](https://github.com/tupe12334/eslint-config/issues)**
- **🔄 [Releases & Changelog](https://github.com/tupe12334/eslint-config/releases)**
- **📖 [ESLint Flat Config Documentation](https://eslint.org/docs/latest/use/configure/configuration-files)**

## Support

This project stands in solidarity with the people of Ukraine 🇺🇦 and Israel 🇮🇱.

---

Made with ❤️ by the eslint-config-agent team. Contributions welcome!
