/**
 * Storybook Configuration
 *
 * ESLint configuration specifically for Storybook story files.
 * Applies to files matching the pattern: "**\/*.stories.{js,jsx,ts,tsx}"
 */

import globals from 'globals'
import { plugins } from '../plugins/index.js'

export const storybookConfig = [
  {
    files: ['**/*.stories.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      storybook: plugins.storybook,
    },
    rules: {
      // Enable recommended storybook rules only
      ...plugins.storybook.configs.recommended.rules,
    },
  },
]
