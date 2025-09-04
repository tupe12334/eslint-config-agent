// Test file for invalid indexed access type assertions
// These patterns should trigger the new ESLint rule

const locales = ['en', 'es', 'fr'] as const;

// This should be invalid - using (typeof X)[number] pattern
const locale1 = "en" as (typeof locales)[number];

// This should also be invalid
const locale2 = "es" as (typeof locales)[0];

// Another invalid pattern with different variable
const colors = ['red', 'blue', 'green'] as const;
const color = "red" as (typeof colors)[number];

// Complex nested case - should also be invalid
const config = {
  themes: ['light', 'dark'] as const
};
const theme = "light" as (typeof config.themes)[number];

// Valid alternative - using a named type (should not trigger error)
type Locale = (typeof locales)[number];
const validLocale = "en" as Locale; // This is still caught by the general as restriction but not by the new rule

// Export to avoid unused variable errors
export { locale1, locale2, color, theme, validLocale };