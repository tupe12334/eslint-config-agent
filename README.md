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
- **🔐 Strict Standards**: Enforces explicit null/undefined checks, disallows optional chaining and nullish coalescing for better code clarity
- **📏 Code Quality**: Function length limits (100 lines), trailing space detection, and consistent formatting
- **🚀 Modern ESLint**: Uses the latest flat configuration format (ESLint 9+)
- **📋 Comprehensive Testing**: 12+ test categories with automated validation
- **🔄 CI/CD Ready**: Zero-warning configuration for production builds

## Installation

### Prerequisites

- **Node.js**: 18.x or higher
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

### Install peer dependencies

The configuration requires several peer dependencies. Install them based on your project needs:

```bash
# Required peer dependencies
npm install --save-dev eslint@^9.34.0 @eslint/js@^9.34.0 @typescript-eslint/eslint-plugin@^8.40.0 @typescript-eslint/parser@^8.40.0 typescript-eslint@^8.40.0 eslint-plugin-react@^7.37.5 eslint-plugin-react-hooks@^5.2.0 eslint-plugin-import@^2.32.0 globals@^16.3.0 @eslint/eslintrc@^3.3.1

# For Preact projects (optional)
npm install --save-dev eslint-plugin-preact@^0.1.0
```

Or use your package manager's peer dependency command:

```bash
# Auto-install peer dependencies with npm 7+
npx install-peerdeps --dev eslint-config-agent

# With pnpm
pnpm install --save-dev $(pnpm info eslint-config-agent peerDependencies --json | jq -r 'to_entries[] | "\(.key)@\(.value)"')
```

## Usage

### Quick Start

Create an `eslint.config.js` file in your project root:

```javascript
import config from "eslint-config-agent";

export default config;
```

### Advanced Configuration

#### Extending with Custom Rules

```javascript
import baseConfig from "eslint-config-agent";

export default [
  ...baseConfig,
  {
    rules: {
      // Override or add your custom rules
      "no-console": "warn",
      "@typescript-eslint/explicit-function-return-type": "error",
    },
  },
];
```

#### Project-Specific Ignores

```javascript
import baseConfig from "eslint-config-agent";

export default [
  ...baseConfig,
  {
    ignores: ["build/**", "dist/**", "coverage/**", "*.config.js"],
  },
];
```

#### File-Specific Overrides

```javascript
import baseConfig from "eslint-config-agent";

export default [
  ...baseConfig,
  {
    files: ["**/*.test.{ts,tsx,js,jsx}"],
    rules: {
      // Relax rules for test files
      "max-lines-per-function": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
      },
    },
  },
];
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
