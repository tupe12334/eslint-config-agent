# Configs Folder

This folder contains file-type-specific ESLint configurations that are composed into the main configuration export.

## Purpose

Each config file in this folder targets a specific file pattern or type (e.g., test files, storybook files, config files) and applies tailored ESLint rules appropriate for that file type.

## Structure

All config files follow this pattern:

```js
/**
 * [Config Name] Configuration
 *
 * Description of what this config does.
 * Applies to files matching: [pattern]
 */

import globals from "globals";
import { plugins } from "../plugins/index.js";

export const [configName]Config = [{
  files: ["pattern/**/*.ext"],
  // ... specific rules for this file type
}];
```

## Available Configs

### `config-files.js`

Configuration for ESLint/config files themselves.

- **Pattern**: `**/eslint.config.{js,cjs,mjs}`, `**/.eslintrc.{js,cjs}`
- **Purpose**: Relaxed rules for configuration files

### `storybook.js`

Configuration for Storybook story files.

- **Pattern**: `**/*.stories.{js,jsx,ts,tsx}`
- **Purpose**: Enables Storybook-specific linting rules

### `test-files.js`

Configuration for test and spec files.

- **Pattern**: `**/*.{test,spec}.{js,jsx,ts,tsx}`, `**/test/**`, `**/__tests__/**`
- **Purpose**: Relaxed rules for test files (allows longer files, multiple exports, etc.)

## Usage

These configs are automatically included in the main configuration export from `index.js`:

```js
import { testFilesConfig } from './configs/test-files.js'
import { storybookConfig } from './configs/storybook.js'
import { configFilesConfig } from './configs/config-files.js'

const config = [
  // ... other configs
  ...testFilesConfig,
  ...storybookConfig,
  ...configFilesConfig,
]
```

## Adding New Configs

To add a new file-type-specific configuration:

1. Create a new file in this folder: `[name].js`
2. Export a config array: `export const [name]Config = [...]`
3. Import and spread it into the main config in `index.js`
4. Update this README

## Note

This folder is for **file-type-specific** configurations only. For feature-based configurations (like DDD enforcement), use the `exports/` folder instead.
