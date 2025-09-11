# Migration Guide

## From Legacy .eslintrc Configuration

If you're migrating from an older ESLint configuration, here's how to transition:

### 1. Remove Old Configuration Files

```bash
# Remove old config files
rm .eslintrc.js .eslintrc.json .eslintrc.yml .eslintrc
```

### 2. Update Package Dependencies

```bash
# Remove old ESLint packages (if present)
npm uninstall @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-react-app

# Install eslint-config-agent and required peer dependencies
npm install --save-dev eslint-config-agent
# ... (see Installation section for full peer dependencies)
```

### 3. Create New Flat Configuration

Replace your old configuration with:

```javascript
// eslint.config.js
import config from 'eslint-config-agent';

export default config;
```

### 4. Update Scripts

Update your package.json scripts to use the flat config:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## From Create React App

If migrating from Create React App's ESLint configuration:

```javascript
// Replace react-scripts ESLint config
import config from 'eslint-config-agent';

export default [
  ...config,
  {
    // Add any CRA-specific overrides you need
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Custom rules for your React app
    }
  }
];
```

## From Airbnb Config

Transitioning from Airbnb's ESLint config:

```javascript
import config from 'eslint-config-agent';

export default [
  ...config,
  {
    // Airbnb users might want these additional rules
    rules: {
      'import/prefer-default-export': 'warn',
      'class-methods-use-this': 'warn',
    }
  }
];
```