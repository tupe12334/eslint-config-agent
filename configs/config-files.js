/**
 * Configuration for configuration files
 * Allows hardcoded values and default exports in config files
 */

export const configFilesConfig = [
  // Configuration files - allow hardcoded values for configuration purposes
  {
    files: [
      '*.config.{js,ts}',
      'eslint.config.{js,ts}',
      'index.js',
      '**/configs/**/*.{js,ts}',
    ],
    rules: {
      'default/no-localhost': 'off',
      'default/no-hardcoded-urls': 'off',
      'default/no-default-params': 'off', // Allow default parameters in config files
      'import/no-default-export': 'off', // Allow default exports in config files
      'max-lines-per-function': 'off', // Allow long functions in config files
      'max-lines': 'off', // Allow long files in config files
      'ddd/require-spec-file': 'off', // Config files don't need spec files
    },
  },
]
