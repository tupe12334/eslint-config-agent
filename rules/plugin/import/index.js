export const importRules = {
  // Import/export organization and restrictions
  "import/group-exports": "error", // Enforce consolidating exports into single statements
  "import/no-default-export": "off", // Allow default exports
  "import/no-namespace": "error",
  // Disabled import rules (keep existing behavior)
  "import/extensions": ["off"],
  "import/no-extraneous-dependencies": ["off"],
  "import/no-unresolved": "off",
  "import/no-absolute-path": "off",
  "import/order": "off",
  "import/newline-after-import": "off",
  "import/first": "off",
  "import/prefer-default-export": "off",
};