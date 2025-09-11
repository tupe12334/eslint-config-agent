# Frequently Asked Questions & Troubleshooting

## Common Issues

### "Cannot find module 'eslint-config-agent'"

**Solution:** Ensure the package is installed correctly:

```bash
npm ls eslint-config-agent
# If not found, reinstall:
npm install --save-dev eslint-config-agent
```

### "Parsing error: Cannot find module '@typescript-eslint/parser'"

**Solution:** Install all required peer dependencies:

```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### ESLint flat config not recognized

**Solution:** Ensure you're using ESLint 9+ and your config file is named `eslint.config.js`:

```bash
npm ls eslint
# Upgrade if needed:
npm install --save-dev eslint@^9.34.0
```

### VS Code not using flat config

**Solution:** Add to your VS Code settings:

```json
{
  "eslint.useFlatConfig": true
}
```

## Frequently Asked Questions

### **Q: Does this work with monorepos?**

A: Yes! Place the `eslint.config.js` at the root of each package, or use a shared config:

```javascript
// packages/shared/eslint.config.js
import baseConfig from 'eslint-config-agent';
export default baseConfig;

// packages/frontend/eslint.config.js
import sharedConfig from '../shared/eslint.config.js';
export default sharedConfig;
```

### **Q: How does this help with AI coding assistants like GitHub Copilot, Claude, or ChatGPT?**

A: This configuration helps AI assistants generate more maintainable and debuggable code by enforcing consistent patterns and preventing problematic shortcuts. This means you get AI assistance while maintaining code that you can actually understand and debug months later.

### **Q: How do I contribute or report issues?**

A: Please use the [GitHub repository](https://github.com/tupe12334/eslint-config) for issues and contributions.

For development setup, testing guidelines, and contribution instructions, see [CONTRIBUTING.md](CONTRIBUTING.md).

### **Q: Can I disable specific rules?**

A: Yes! You can override any rules in your `eslint.config.js`:

```javascript
import baseConfig from 'eslint-config-agent';

export default [
  ...baseConfig,
  {
    rules: {
      // Disable a specific rule
      'no-console': 'off',
      // Or change its severity
      'max-lines-per-function': 'warn',
    },
  },
];
```

### **Q: Does this work with JavaScript projects (non-TypeScript)?**

A: Yes! The configuration automatically detects file types and applies appropriate rules for both JavaScript and TypeScript files.

### **Q: Why does this configuration disallow optional chaining (?.)?**

A: This is intentional for AI-era development. Optional chaining can hide potential runtime issues and make debugging harder. The configuration encourages explicit null/undefined checks that make your code more maintainable and easier to understand.

### **Q: How do I run ESLint with this configuration?**

A: Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:ci": "eslint . --max-warnings 0"
  }
}
```

Then run:
- `npm run lint` - Check for issues
- `npm run lint:fix` - Fix auto-fixable issues
- `npm run lint:ci` - Strict checking for CI/CD

### **Q: Can I use this with Prettier?**

A: Yes! This configuration focuses on code quality rules and doesn't conflict with Prettier's formatting rules. You can use both together safely.

## Need More Help?

If you don't find your answer here:

1. Check the [GitHub Issues](https://github.com/tupe12334/eslint-config/issues) for similar problems
2. Review the [CONTRIBUTING.md](CONTRIBUTING.md) for development setup
3. Create a new issue with:
   - Your ESLint version
   - Your Node.js version  
   - A minimal reproduction case
   - The error message you're seeing